pub mod instruction;
use instruction::MoveInstruction;
use solana_program::{account_info::AccountInfo, declare_id, entrypoint, entrypoint::ProgramResult, msg, pubkey::Pubkey};

declare_id!("3qY4HbxwnR876vcUV842NY9BBgfPHHBsJ1u95QfQCf6V");

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult{
    // msg!("Hello World");
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
