import React from 'react';
import Layout from '@/layout/Layout';
import Footer from '@/layout/Footer/Footer';
import Navbar from '@/layout/Header/Navbar';
import LatestBlog from '@/components/blogs/LatestBlog';
import PageHeader from '@/components/common/PageHeader';
import SupportOne from '@/components/support/SupportOne';
import BlogSingleFeature from '@/components/blogs/BlogSingleFeature';
import { getAllBlogIds, getBlogData } from '@/lib/posts';

export async function getStaticPaths() {
  const paths = getAllBlogIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const blogData = getBlogData(params.blogId);
  return {
    props: {
      blogData,
    },
  };
}

const BlogSingle = ({ blogData }) => {
  const { title, description, blog, date, author, link } = blogData;
  const metaTitle = `CopywriterPro Blog - ${title}`;
  const blogMetaData = {
    author,
    date,
  };

  const images = [
    {
      "url": `https://copywriterpro.ai/blog-images${link}${link}.webp`,
      "width": 800,
      "height": 600,
      "alt": title
    }
  ];

  return (
    <Layout title={ metaTitle } description={ description } images={ images }>
      <Navbar classOption="navbar-light" />
      <PageHeader title={ title } blogMetaData={ blogMetaData } />
      <BlogSingleFeature blog={ blog } />
      {/* <NewsLetter /> */}
      <LatestBlog />
      <SupportOne className />
      <Footer footerLight />
    </Layout>
  );
};

export default BlogSingle;
