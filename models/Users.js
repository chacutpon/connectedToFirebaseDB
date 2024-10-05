const mongoose = require("mongoose")
const admin = require('../config/firebase')

const userSchema = mongoose.Schema({
    name: String,
    email: {
        type: String,
        require: true //หมายถึงค่านี้ห้ามว่างถ้าว่างจะ error
    },
    role:{
        type: String,
        default: 'user',
    },
   
},{timestamps: true}) //จะโชว์ created,updated

userSchema.statics.findByUid = async function(uid) {
    try {
        const firestore = admin.firestore(); // ใช้ admin.firestore() จาก firebase.js (ฝั่งหลังบ้าน)
        const userProfileRef = firestore.collection('players').doc(uid); 
        const userProfileSnapshot = await userProfileRef.get();

        if (!userProfileSnapshot.exists) {
            return null; // หรือ handle กรณีไม่พบข้อมูลตามความเหมาะสม
        }

        const userProfileData = userProfileSnapshot.data();
        return userProfileData;
    } catch (err) {
        console.error('Error fetching user profile from Firestore:', err);
        throw err; // ส่ง error ต่อเพื่อให้ controller หรือส่วนอื่นๆ จัดการได้
    }
};
module.exports = mongoose.model('Users',userSchema) //(ชื่อโมเดล,schema)
