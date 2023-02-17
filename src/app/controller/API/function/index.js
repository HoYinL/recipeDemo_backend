import User from "../../../models/users.js";
import PublishedPostList from "../../../models/publishedpostlist.js";
import PublishedPost from "../../../models/publishedpost.js";
import Contributers from "../../../models/contributers.js";
import Recipes from '../../../models/landingpagerecipes.js';
import Comment from "../../../models/comment.js";

export const getAuthorPosts = async (req, res) => {
    const { limit, userId } = req.params;
    const limitLength = parseInt(limit);

    try {
        const user = await User.findById(userId);

        const publishedPostList = await PublishedPostList.findById(user.publishedPostList);

        const postList = [...publishedPostList.postList];
        const returnPostList = postList.splice(0, limitLength * 10);

        res.status(200).json({ posts: returnPostList })
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getBlogContent = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await PublishedPost.findById(id);

        res.status(200).json({ blog });
    } catch (error) {
        res.status(500).send(error)
    }
};

export const getUserInfo = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).send(error)
    }
};

export const sortPost = async (req, res) => {
    try {
        PublishedPost.find({})
            .populate('feature')
            .exec((err, post) => {
                if (err) throw new Error(`processing error in request`);

                const sortByMarkedNo = (post1, post2) => {
                    const bookmark1 = post1.bookmarked || 0;
                    const bookmark2 = post2.bookmarked || 0;
                    return -(bookmark1 - bookmark2)
                };

                post.sort(sortByMarkedNo);
                const return_posts = post.slice(0, 20);
                res.status(200).send({ posts: return_posts });
            })
    } catch (error) {
        res.status(500).send(error);
    }
};

export const sortUser = async (req, res) => {
    try {
        User.find({})
            .populate('followerList')
            .exec((err, user) => {
                if (err) throw new Error(`processing error in request`);
                const sort_fun = (user1, user2) => {
                    const followerNo1 = user1.followerList?.followerList?.length || 0;
                    const followerNo2 = user2.followerList?.followerList?.length || 0;
                    return -(followerNo1 - followerNo2)
                };

                user.sort(sort_fun);
                const return_user = user.slice(0, 20);
                res.status(200).send({ users: return_user });
            })
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getContributers = async (req, res) => {
    try {
        const contributers = await Contributers.find({});

        res.status(200).json( contributers );
    } catch (err) {
        res.status(500).json({ err });
    }
};

export const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipes.find({});

        res.status(200).json( recipes );
    } catch (err) {
        res.status(500).json({ err });
    }
};

export const getComment = async (req, res) => {
    try {
        const comment = await Comment.find({});

        res.status(200).json( comment );
    } catch (err) {
        res.status(500).json({ err });
    }
};
