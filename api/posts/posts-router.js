// implement your posts router here
const express = require('express');
const router = express.Router();

const Post = require('./posts-model')

router.get('/', (req, res) => {
    Post.find()
    .then(posts => res.json(posts))
    .catch(() => res.status(500).json({ message: "The posts information could not be retrieved" }) )
})

router.get('/:id', (req, res) => {
    const { id } = req.params
    Post.findById(id)
    .then(post => {
        if(!post){
            res.status(404).json({ message: 'The post with the specified ID does not exist'})
        } else {
            res.json(post)
        }
    })
    .catch(() => res.status(500).json({ message: "The post information could not be retrieved" }))
})

router.post('/', (req, res) => {
    const newPost = req.body
    if (!newPost.title || !newPost.contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" })
    } else {
        Post.insert(newPost)
        .then(({id}) => {
            return Post.findById(id)
        })
        .then((post) => res.status(201).json(post))
        .catch(() => res.status(500).json({ message: 'There was an error while saving the post to the database'}))
    }
})

router.put('/:id', (req, res) => {
    const { id } = req.params
    const updates = req.body

    if(!updates.title || !updates.contents) {
        res.status(400).json({ message:"Please provide title and contents for the post" })
    } else {
        Post.update(id, updates)
        .then((updatedPost) => {
            if(!updatedPost) {
                res.status(404).json({message: 'The post with the specified ID does not exist'})
            } else {
                return Post.findById(id)
            }
        })
        .then(post => res.json(post))
        .catch(() => res.status(500).json({ message: 'The post information could not be modified' }))
    }
})

router.delete('/:id', (req, res) => {
    const {id} = req.params

    Post.findById(id)
    .then(deletedPost => {
        if(!deletedPost) {
            res.status(404).json({ message: 'The post with the specified ID does not exist'})
        } else {
            res.json(deletedPost)
            return Post.remove(id)
        }
    })
    .catch(() => res.status(500).json({ message: 'The post could not be removed'}))
})

router.get('/:id/comments', (req, res) => {
    const {id} = req.params
    Post.findById(id)
    .then(post => {
        if(!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist"})
        } else {
            return Post.findPostComments(id)
        }
    })
    .then(comments => {
        if(comments){
            res.json(comments)
        }
    })
    .catch(() => res.status(500).status({ message: 'The comments information could not be retrieved'}))
})
module.exports = router;