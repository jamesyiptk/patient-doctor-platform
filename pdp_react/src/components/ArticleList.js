// ArticleList.js
import React from 'react';
import axios from 'axios';
import { ProList } from '@ant-design/pro-components';
import { Tag, Button, Select  } from 'antd';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";

import Sto from '../static/sto.jpg';
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

const ArticleList = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [articles, setArticles] = useState([]); // save article data

  useEffect(() => {
    // use axios
    axios.get('http://localhost:8000/api/articles/')
      .then(response => {
        console.log(response.data);
        const fetchedArticles = response.data.map(article => ({
          title: article.title, 
          content: article.content,
          category_name : article.category_name ,
          isExpanded: false,
        }));
        setArticles(fetchedArticles);
      })
      .catch(error => console.error('Error fetching articles:', error));
  }, []); 

  const toggleExpand = (title) => {
    const updatedArticles = articles.map((article) => {
      
      if (article.title === title) {
        // console.log('here');
        // console.log(article);
        return { ...article, isExpanded: !article.isExpanded };
      }
      

      return article;
    });
    setArticles(updatedArticles);
  };


  const filteredArticles = selectedCategory
    ? articles.filter(article => article.category_name.toString() === selectedCategory)
    : articles;
  return (
    <>
      <Select defaultValue="" style={{ width: 200 }} onChange={value => setSelectedCategory(value)}>
        <Select.Option value="">All articles(General)</Select.Option>
        {/* Dynamically generate category options */}
        {Object.entries(CATEGORY_MAP).map(([value, label]) => (
          <Select.Option key={value} value={label}>{label}</Select.Option>
        ))}
      </Select>
      <ProList
        toolBarRender={() => {
          // return [
          //   <Button key="3" type="primary">
          //     新建
          //   </Button>,
          // ];
        }}
        itemLayout="vertical"
        rowKey="title"
        headerTitle="Common articles"
        dataSource={filteredArticles}
        metas={{
          title: {},
          description: {
            
            render: (title,article) => {
              // console.log(title);
              // console.log(article);
              return (
                
              <>
                <Tag>{article.category_name }</Tag>
              </>
              );
              
            },  
          },
          actions: {
            render: () => [
              <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
              <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
              <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
              
            ],
          },
          extra: {
            render: () => (
              <img
                width={300}
                height = {200}
                alt="logo"
                src={Sto}
              />
            ),
          },
          content: { 
            render: (content, article) => { // Assuming the first param is the content, and the second is the full article object
              // console.log('test');
              // console.log(article.category); // Now correctly logging the content
              return (
                <>
                  <div style={{ height: article?.isExpanded ? 'auto' : '150px', overflow: 'hidden' }}>
                    {/* Rendering the content directly */}
                    {content}
                  </div>
                  <Button type="link" onClick={() => toggleExpand(article?.title)}>
                    {article?.isExpanded ? 'Show Less' : 'Show More'}
                  </Button>
                </>
              );
            },
          },
        }}
      />
    </>
    
  );
};



export default ArticleList;
