pub mod instruction;
pub mod state;
use borsh::BorshSerialize;
use instruction::MoveInstruction;
use solana_program::{account_info::{next_account_info, AccountInfo}, borsh0_10::try_from_slice_unchecked, declare_id, entrypoint, entrypoint::ProgramResult, msg, program::invoke_signed, pubkey::Pubkey, rent::Rent, system_instruction, system_program, sysvar::Sysvar};

use crate::state::MovieAccountState;

declare_id!("3qY4HbxwnR876vcUV842NY9BBgfPHHBsJ1u95QfQCf6V");

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult{
    let instruction = MoveInstruction::unpack(instruction_data)?;
    match instruction {
        MoveInstruction::AddMovieReview { title, rating, description } => { 
            let _ = add_movie_review(program_id, accounts, title, rating, description);
        }
    }

    Ok(())
}


pub fn add(left: usize, right: usize) -> usize {
    left + right
}

pub fn add_movie_review(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    title: String,
    rating: u8,
    description: String
) -> ProgramResult {
    msg!("Adding movie review ....");
    msg!("Title:{}, Rating: {}, Description:{}", &title, &rating, &description);
    let account_info_iter = &mut accounts.iter();
    let initializer = next_account_info(account_info_iter)?;
    let pda_account = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;

    let (pda, bump_seed) = Pubkey::find_program_address(&[initializer.key.as_ref(), title.as_bytes().as_ref()], program_id);
    let account_len: usize = 1+ 1 + (4 + title.len()) + (4 + description.len());
    // Calculate rent required
    let rent = Rent::get()?;
    let rent_lamports = rent.minimum_balance(account_len);
    let _ = invoke_signed(
        &system_instruction::create_account(
            initializer.key, 
            pda_account.key, 
            rent_lamports, 
            account_len.try_into().unwrap(), 
            program_id), 
            &[initializer.clone(), pda_account.clone(), system_program.clone()], 
            &[&[initializer.key.as_ref(), title.as_bytes().as_ref(), &[bump_seed]]]
        )?;
    msg!("PDA created:{}", pda); 
    msg!("unpacking state account");
    let mut account_data = try_from_slice_unchecked::<MovieAccountState>(&pda_account.data.borrow()).unwrap();
    msg!("borrowed account data");
    account_data.title = title;
    account_data.description = description;
    account_data.rating = rating;
    account_data.is_initialized = true;
    msg!("serializing account");
    account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;
    msg!("state account serialized");
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
