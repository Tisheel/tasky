import pg from 'pg'
const { Client } = pg

export default async () => {
    const client = new Client(process.env.POSTGRESQL_URL)
    try {
        await client.connect()
    } catch (error) {
        console.log(error)
    }
    return client
}