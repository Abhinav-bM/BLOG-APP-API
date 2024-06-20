/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       404:
 *         description: User not found or incorrect password
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /createBlog:
 *   post:
 *     summary: Create a new blog
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Blog created successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /updateBlog/{id}:
 *   put:
 *     summary: Update an existing blog
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /deleteBlog/{id}:
 *   delete:
 *     summary: Delete a blog
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /getAllBlogs:
 *   get:
 *     summary: Retrieve all blogs
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: A list of blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /addComment/{id}:
 *   post:
 *     summary: Add a comment to a blog
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment added successfully
 *       404:
 *         description: Blog not found or Comment not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /editComment/{blogId}/{commentId}:
 *   put:
 *     summary: Edit a comment on a blog
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment edited successfully
 *       404:
 *         description: Blog not found or Comment not found or User not authorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /deleteComment/{blogId}/{commentId}:
 *   delete:
 *     summary: Delete a comment from a blog
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Blog not found or Comment not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /addReview/{blogId}:
 *   post:
 *     summary: Add a review to a blog
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review added successfully
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /editReview/{blogId}/{reviewId}:
 *   put:
 *     summary: Edit a review on a blog
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review edited successfully
 *       404:
 *         description: Blog not found or Review not found or User not authorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /deleteReview/{blogId}/{reviewId}:
 *   delete:
 *     summary: Delete a review from a blog
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Blog not found or Review not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /follow/Unfollow/{id}:
 *   post:
 *     summary: Follow or unfollow a user
 *     tags: [Follow]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User followed or unfollowed successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /getFollowers:
 *   get:
 *     summary: Get followers of the logged-in user
 *     tags: [Follow]
 *     responses:
 *       200:
 *         description: A list of followers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /getFollowing:
 *   get:
 *     summary: Get users followed by the logged-in user
 *     tags: [Follow]
 *     responses:
 *       200:
 *         description: A list of users followed
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */