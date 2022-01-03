const router = require('express').Router();
const ChatRoom = require('../models/ChatRoom')
const User = require('../models/User');
const messageService = require('../services/messageService')

router.post('/createChatRoom', async (req, res) => {
    
    const { message, receiver } = req.body;
    try {
        let chatRoom = await messageService.createChatRoom(req.user._id, receiver)
        await ChatRoom.updateOne({ _id: chatRoom._id }, { $push: { conversation: { senderId: req.user._id, message } } })
        res.status(200).json({ messageId: chatRoom._id })
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/getUserConversations', async (req, res) => {
    let allChats = await ChatRoom.find().populate("buyer").populate("seller");
    // console.log(11111111111,allChats[allChats.length-1]);
    let userChats = allChats.filter(x => x.buyer && x.buyer._id == req.user._id || x.seller && x.seller._id == req.user._id)
    let checkedChats = userChats.map(x => ({ chats: x, isBuyer: (x.buyer && x.buyer._id == req.user._id), myId: req.user._id }))
    res.status(200).json(checkedChats)
})

router.post('/sendMessage', async (req, res) => {
    const { chatId, message } = req.body;
    console.log(req.body);
    let chat = await ChatRoom.updateOne({ _id: chatId }, { $push: { conversation: { senderId: req.user._id, message } } })

    console.log(chat)
    res.status(200).json({ sender: req.user._id })
})

module.exports = router;