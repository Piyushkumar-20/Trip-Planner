import mongoose from "mongoose"

export const connectionDB = async() => {
    const connection = await mongoose.connect(process.env.DATABASE_URL)
    console.log(`Connected: ${connection.connection.host}`)
}

