import Content from '../../../models/content.js';
import mongoose from 'mongoose';

export const getContent = async (req, res) => {
    const { contentId } = req.params;

    try {
        const publishedContent = await Content.findById(contentId);

        res.status(200).json({ content: publishedContent.content });
    } catch (error) {
        res.status(500).send(error);
    }
};

export const uploadContent = async (req, res) => {
    const { content } = req.body;

    const newContent = new Content({
        _id: new mongoose.Types.ObjectId(),
        content,
    });

    try {
        const content = await newContent.save();

        res.status(200).json({ content: content._id });
    } catch (error) {
        res.status(500).send(error);
    }
};

export const deleteContent = async (req, res) => {
    const { contentId } = req.params;

    try {
        await Content.findByIdAndDelete(contentId);

        res.status(200).json({ success: 'content is deleted' });
    } catch (err) {
        res.send(err);
    };
};

