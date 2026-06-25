import mongoose from "mongoose"

export const connectionDB = async() => {
    const connection = await mongoose.connect(process.env.DATABASE_URL, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    });
    console.log(`Connected: ${connection.connection.host}`)
}

