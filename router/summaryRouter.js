const express = require('express');
const router = express.Router();

const Summary = require('../module/dailysummary');
const { jwtAuthMiddleware } = require('../jwt');

router.post('/addsummary', jwtAuthMiddleware, async (req, res) => {
    try{
        const userId = req.user._id;
        const { weekNumber, day, summary} = req.body;

        // correct summary data 
        
        let userSummary = await Summary.findOne({ userId });
        if(!userSummary) {
            userSummary = new Summary({ 
                userId,
                weeks: [{ weekNumber, summaries: [{ day, summary }] }]
             });
        }
        else {
            let week = userSummary.weeks.find(data => data.weekNumber === weekNumber);
            if(!week) {
                userSummary.weeks.push({
                    weekNumber,
                    summaries: [{ day, summary }]
                });
            }
            else {
                week.summaries.push({ day, summary });
            }
        }

        const response = await userSummary.save();
        if(!response) return res.status(404).json({ message: 'Failed to add summary' });
        res.status(200).json({ message: 'Summary added successfully', summary: response });
    } catch(error){ 
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

router.get('/getsummary', jwtAuthMiddleware, async (req, res) => {
    try{
        const userId = req.user._id;
        const response = await Summary.find({userId});
        if(!response) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'Summary fetched successfully', response : response });
    } catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;

