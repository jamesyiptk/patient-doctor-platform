// PostList.js
import React from 'react';
import axios from 'axios';
import { ProList } from '@ant-design/pro-components';
import { Tag, Button, Select, message, Form } from 'antd';
import { LikeOutlined, MessageOutlined, StarOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { ModalForm, ProFormText, ProFormTextArea, ProFormSelect, ProFormRate } from '@ant-design/pro-form';
import { useUser } from '../contexts/UserContext';

import VaImage from '../static/Va.webp';
const IconText = ({ icon, text }) => (
    <span>
        {React.createElement(icon, { style: { marginRight: 8 } })}
        {text}
    </span>
);

const CATEGORY_MAP = {
    '2': 'Internal Medicine',
    // Add mappings for other categories
};

const categoryOptions = [
    // { label: 'General', value: 'General' },
    { label: 'Internal medicine', value: 'Internal medicine' },
    // Add more categories as needed
];

const PostList = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form] = Form.useForm();
    const [activePostId, setActivePostId] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
    const [formComment] = Form.useForm();
    const [visibleRatingModal, setVisibleRatingModal] = useState(false);
    const [ratingForm] = Form.useForm();
    const { user} = useUser();

    const handleAddComment = async (values) => {
        const commentData = {
            text: values.text,
            post: values.post, // Assuming 'post' is the field name expected by your backend
        };
        try {
            // console.log(commentData);
            await axios.post('http://localhost:8000/api/comments/', commentData);
            message.success('Comment added successfully');
            formComment.resetFields(); // Reset the form fields after successful submission
            setIsCommentModalVisible(false); // Close the modal
            // form.resetFields()
            fetchPosts(); // Re-fetch posts to update the comments (assuming fetchPosts also fetches comments)
        } catch (error) {
            console.error('Failed to add the comment', error);
            message.error('Failed to add the comment');
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/posts/');
            // console.log(response.data);
            const fetchedPosts = response.data.map(post => ({
                id: post.id,
                comments: post.comments || [],
                title: post.title,
                content: post.content,
                category_name: post.category_name || 'General',
                isExpanded: false,
            }));
            setPosts(fetchedPosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            message.error('Failed to fetch posts');
        }
    };
    const handleRateSubmit = async (values) => {
        // console.log('Rating Data:', values);
        setVisibleRatingModal(false);
        message.success('Rating submitted successfully');
        // Implement API call to submit the rating here
    };
    const openRatingModal = (postId) => {
        setActivePostId(postId);
        setVisibleRatingModal(true);
    };
    useEffect(() => {
        // use axios
        fetchPosts();

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/categories/');
                const categoriesData = response.data.map(category => ({
                    label: category.name,
                    value: category.name, // 或者 category.id 根据你的后端返回的数据结构调整
                }));
                setCategories(categoriesData);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const toggleExpand = (title) => {
        const updatedPosts = posts.map((post) => {

            if (post.title === title) {
                // console.log('here');
                // console.log(article);
                return { ...post, isExpanded: !post.isExpanded };
            }


            return post;
        });
        setPosts(updatedPosts);
    };


    const filteredPosts = selectedCategory
        ? posts.filter(post => post.category_name.toString() === selectedCategory)
        : posts;



    const createPost = async (values) => {
        console.log('here user');
        console.log(user);
        if(user.crypto >10){
            const postData = {
                title: values.title,
                content: values.content,
                category_name: values.category,
            };

            try {
                // Send a POST request to the server to create a new post
                const response = await axios.post('http://localhost:8000/api/posts/', postData, {
                    withCredentials: true // Include this if your API requires session or cookie-based authentication
                });
            
                // Optional: Check if the POST request was successful
                if (response.status === 201 || response.status === 200) {
                    const cryptoUpdateResponse = await axios.put(`http://localhost:8000/api/users/${user.id}/update_crypto/`, {
                        crypto: user.crypto - 10
                    }, {
                        withCredentials: true
                    });
                    message.success('Post created successfully');
                    fetchPosts(); // Assuming fetchPosts is a function that fetches all posts to update the UI
                    form.resetFields(); // Assuming 'form' is passed from the component where this function is used
                } else {
                    // Handle any other status codes here as per your API's design
                    message.error('Failed to create the post: Unexpected response');
                }
            } catch (error) {
                console.error('Failed to create the post', error);
                message.error('Failed to create the post: ' + (error.response?.data?.message || error.message));
            }
        }
        
    };

    const [visibleCommentPostId, setVisibleCommentPostId] = useState(null);

    const toggleCommentsVisibility = (postId) => {
        // Toggle visibility off if the same post ID is clicked again, otherwise show the new post's comments
        // console.log('used');
        setVisibleCommentPostId(visibleCommentPostId === postId ? null : postId);
    };

    return (
        <>
            <Select defaultValue="" style={{ width: 200 }} onChange={value => setSelectedCategory(value)}>
                <Select.Option value="">All articles(General)</Select.Option>
                {/* Dynamically generate category options */}
                {/* {Object.entries(CATEGORY_MAP).map(([value, label]) => (
                    <Select.Option key={value} value={label}>{label}</Select.Option>
                ))} */}
                {categoryOptions.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                        {option.label}
                    </Select.Option>
                ))}
            </Select>
            {/* <NewPostForm onNewPost={(newPost) => setPosts([...posts, newPost])} /> */}
            <ModalForm
                form={form}
                title="New Post"
                trigger={
                    <Button type="primary" icon={<PlusOutlined />}>
                        Ask a question
                    </Button>
                }
                onFinish={async (values) => {
                    createPost(values);
                    // message.success('Post created successfully');
                    // Optionally close the modal and clear the form here
                    return true;
                }}
            >
                <ProFormText
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: 'Please input the title of the post!' }]}
                />
                <ProFormTextArea
                    name="content"
                    label="Content"
                    rules={[{ required: true, message: 'Please input the content of the post!' }]}
                />
                <ProFormSelect
                    options={categories}
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: 'Please select a category for the post!' }]}
                />
            </ModalForm>
            <ProList
                toolBarRender={() => {
                    // return [
                    //     <Button key="3" type="primary">
                    //         New
                    //     </Button>,
                    // ];
                }}
                itemLayout="vertical"
                rowKey="title"
                headerTitle="Patient consultation"
                dataSource={filteredPosts}
                metas={{
                    title: {},
                    description: {

                        render: (_, post) => {
                            // console.log(post);
                            // console.log(article);
                            return (

                                <>
                                    <Tag>{post.category_name}</Tag>
                                </>
                            );

                        },
                    },
                    actions: {
                        render: (text, post) => [
                            <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                            <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                            // <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                            // <IconText 
                            //     icon={MessageOutlined} 
                            //     text="2" 
                            //     key="list-vertical-message"
                            //     onClick={() => toggleCommentsVisibility(post.id)}
                            // />,
                            <Button
                                type="link"
                                icon={<MessageOutlined />}
                                onClick={() => toggleCommentsVisibility(post.id)}
                            >
                                {visibleCommentPostId === post.id ? 'Hide Answers' : 'Show Answers'}
                            </Button>,
                            <ModalForm
                                title="Add Comment"
                                
                                form={formComment}
                                onFinish={async (values) => {
                                    await handleAddComment({ text: values.comment, post :post.id });
                                    return true;
                                }}
                                onCancel={() => setIsCommentModalVisible(false)}
                                trigger={
                                    <Button type="primary" icon={<PlusOutlined />}>
                                        Answer
                                    </Button>
                                }
                            >
                                
                                <ProFormTextArea
                                    name="comment"
                                    label="Comment"
                                    rules={[{ required: true, message: 'Please input your comment!' }]}
                                />
                            </ModalForm>,
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => openRatingModal(post.id)}>
                            Finish
                        </Button>,
                        <ModalForm
                            open={visibleRatingModal && activePostId === post.id}
                            form={ratingForm}
                            title="Rate Commenter"
                            onFinish={handleRateSubmit}
                            onOpenChange={setVisibleRatingModal}
                        >
                            <ProFormRate name="rating" label="Rating" required />
                            <ProFormText name="review" label="Review" placeholder="Write a review" />
                        </ModalForm>,


                        ],
                    },
                    extra: {
                        // render: () => (
                        //     <img
                        //         width={300}
                        //         height={200}
                        //         alt="logo"
                        //         src={VaImage}
                        //     />
                        // ),
                    },
                    content: {
                        render: (content, post) => { // Assuming the first param is the content, and the second is the full article object
                            // console.log(post);
                            // console.log(article.category); // Now correctly logging the content
                            return (
                                <>
                                    <div style={{ height: post.isExpanded ? 'auto' : '150px', overflow: 'hidden' }}>
                                        {content}
                                        {/* Display comments if they exist */}

                                    </div>
                                    {/* <Button type="link" onClick={() => toggleExpand(post.title)}>
                                        {post.isExpanded ? 'Show Less' : 'Show More'}
                                    </Button> */}
                                    {visibleCommentPostId === post.id && (
                                        <div>
                                            {/* 这里是渲染评论的地方 */}
                                            {/* Comments for {post.title} */}
                                            {post.comments && post.comments.map((comment, index) => (
                                                <div key={index} style={{ marginTop: 10, backgroundColor: '#f0f2f5', padding: '8px', borderRadius: '4px' }}>
                                                    <p>{comment.text}</p>
                                                    <small>{comment.author.username} - {new Date(comment.created_at).toLocaleString()}</small>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                </>
                            );
                        },
                    },
                }}
            />
        </>

    );
};



export default PostList;
