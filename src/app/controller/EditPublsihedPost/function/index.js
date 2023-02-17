import PublishedFeatures from '../../../models/publishedfeatures.js';
import PublishedPost from '../../../models/publishedpost.js';

export const getPublishedPost = async (req, res) => {
    const { postId } = req.params;

    const post = await PublishedPost.findById(postId);

    res.json({ post });
};

export const EditPublishedPost = async (req, res) => {
    const { postId } = req.params;
    const { dishName, description, backgroundImg, tagList } = req.body.featureData;
    const { blogContent } = req.body;

    const dish_name = dishName;

    try {
        const publishedPost = await PublishedPost.findById(postId);
        await PublishedFeatures.findByIdAndUpdate(publishedPost.feature, { dish_name, description, backgroundImg, tagList, });

        const originalPostContent = [...publishedPost.content];
        post.content = blogContent;

        await post.save();

        res.status(200).json(originalPostContent);
    } catch (error) {
        res.send('sth happen')
    }
};