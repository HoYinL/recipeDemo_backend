import User from '../../../models/users.js';
import AutoSaveData from '../../../models/autosavedata.js';
import AutoSaveBlog from '../../../models/autosaveblog.js';
import SavedPost from '../../../models/savedposts.js';
import SavedContent from '../../../models/savedcontent.js';
import mongoose from 'mongoose';

export const getNewPost = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        const savedPostList = await SavedPost.findById(user.savedPostList);
        const savedPost = await AutoSaveBlog.findById(savedPostList.firstCreate);

        res.status(200).json({ post: savedPost });
    } catch (err) {
        res.status(500).send(err);
    }

};

export const saveNewPost = async (req, res) => {
    const { userId } = req.params;
    const { dishName, description, backgroundImg, tagList } = req.body.featureData;
    const { blogContent } = req.body;

    const dish_name = dishName;

    try {
        const user = await User.findById(userId);
        const savedPost = await SavedPost.findById(user.savedPostList || user.autoSaveContent);

        const postUsedToBeSaved = (savedPost.firstCreate != undefined);

        if (postUsedToBeSaved) {
            const savedBlog = await AutoSaveBlog.findById(savedPost.firstCreate);
            const savedContent = [...savedBlog.content]
            savedBlog.content = blogContent;

            await savedBlog.save();

            res.status(200).json({ content: savedContent });
        } else {
            const newAutoSavedFeatures = new AutoSaveData({
                dish_name,
                description,
                backgroundImg,
                tagList,
                _id: new mongoose.Types.ObjectId(),
            });

            const newAutoSavedBlog = new AutoSaveBlog({
                content: blogContent,
                feature: new mongoose.Types.ObjectId(),
                _id: new mongoose.Types.ObjectId(),
                createAt: Date.now()
            });

            const savedData = await newAutoSavedFeatures.save();

            newAutoSavedBlog.feature = savedData._id;

            const savedBlog = await newAutoSavedBlog.save();

            savedPost.firstCreate = savedBlog._id;
            savedPost.postList = [savedBlog._id, ...savedPost.postList];

            await savedPost.save();

            res.status(200).json({ content: [] });
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

export const getExistingPost = async (req, res) => {
    const { postId } = req.params;

    try {
        const savedPost = await AutoSaveBlog.findById(postId);

        res.status(200).json({ post: savedPost });
    } catch (err) {
        res.status(500).send(err);
    }
};


export const saveExistingPost = async (req, res) => {
    const { postId } = req.params;
    const { blogContent } = req.body;
    const { dishName, description, backgroundImg, tagList } = req.body.featureData;

    const dish_name = dishName;

    try {
        const savedBlog = await AutoSaveBlog.findById(postId);

        const savedContent = [...savedBlog.content]
        savedBlog.content = blogContent;

        await savedBlog.save();
        await AutoSaveData.findByIdAndUpdate(blogContent.feature, { dish_name, description, backgroundImg, tagList });

        res.status(200).json({ content: savedContent });
    } catch (err) {
        res.status(500).send(err)
    }
};

export const saveContent = async (req, res) => {
    const newSavedContent = new SavedContent({
        content: req.body.content,
        _id: new mongoose.Types.ObjectId(),
    });

    try {
        const savedContent = await newSavedContent.save();

        res.status(200).json({ content: savedContent._id });
    } catch (err) {
        res.status(500).send(err);
    }
};

export const getSavedContent = async (req, res) => {
    const { contentId } = req.params;

    try {
        const savedContent = await SavedContent.findById(contentId);

        res.status(200).json({ content: savedContent.content });
    } catch (err) {
        res.status(500).send(err)
    }
};

export const emptyPostContent = async (req, res) => {
    const { postId } = req.params;

    try {
        const savedPost = await AutoSaveBlog.findById(postId);
        savedPost.content = [];

        await savedPost.save();

        res.status(200).json({ success: 'blogContent delete successfully' });
    } catch (err) {
        res.status(500).send(err);
    }
};

export const deleteSavedContent = async (req, res) => {
    const { contentId } = req.params;

    try {
        await SavedContent.findByIdAndDelete(contentId);

        res.status(200).json({ success: 'blogContent delete successfully' });
    } catch (error) {
        res.status(500).send(err);
    }
};