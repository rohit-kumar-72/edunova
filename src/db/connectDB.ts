import mongoose from 'mongoose';

async function connectDB() {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONOGO_URI!)

        console.log(`\n MONGODB CONNECTED !! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MONGODB CONNECTION ERROR!!!\n", error);
        process.exit(1);
    }
}

export default connectDB;