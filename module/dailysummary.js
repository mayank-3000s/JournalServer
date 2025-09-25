const mongoose = require("mongoose");

const dailySummarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  weeks: [
    {
      weekNumber: Number, 
      summaries: [
        {
          day: {
            type: String,
            enum: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday"
            ],
            required: true
          },
          summary: {
            type: String,
            required: true
          },
          createdAt: {
            type: Date,
            default: Date.now
          }
        }
      ]
    }
  ]
}, { timestamps: true });

const DailySummary = mongoose.model("DailySummary", dailySummarySchema);
module.exports = DailySummary;
