import { Card } from './Card'
import { FC, useEffect, useState } from 'react'
import { Movie } from '../models/Movie'
import { useConnection } from "@solana/wallet-adapter-react"
import { PublicKey } from '@solana/web3.js'
import base58 from 'bs58'

const MOVIE_REVIEW_PROGRAM_ID = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN'

export const MovieList: FC = () => {
    const { connection } = useConnection();
    const [movies, setMovies] = useState<Movie[]>([])

    useEffect(() => {
        connection.getProgramAccounts(new PublicKey(MOVIE_REVIEW_PROGRAM_ID), {
            dataSlice: { offset: 2, length: 18 },
            filters: [
                {
                    memcmp: {
                        offset: 6,
                        bytes: base58.encode(Buffer.from('te'))
                    }
                }
            ]
        }).then(async (orginalAccounts) => {
            const paginatedPublicKeys = orginalAccounts.map(account => account.pubkey)
            const accounts = await connection.getMultipleAccountsInfo(paginatedPublicKeys)

            const movies = accounts.reduce((accum: Movie[], account) => {
                const movie = Movie.deserialize(account?.data)
                if (!movie) {
                    return accum
                }

                return [...accum, movie]
            }, [])

            // const movies: Movie[] = accounts.reduce((accum: Movie[], {account}) => {
            //     const movie = Movie.deserialize(account.data);
            //     if(!movie) {
            //         return accum
            //     }
            //     return [...accum, movie]
            // }, []);
            setMovies(movies)
        })

    }, [])

    return (
        <div>
            {
                movies.map((movie, i) => {
                    return (
                        <Card key={i} movie={movie} />
                    )
                })
            }
        </div>
    )
}