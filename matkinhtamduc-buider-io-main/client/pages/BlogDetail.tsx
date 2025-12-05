import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  User,
  Tag,
  ThumbsUp,
  BookmarkPlus,
  Facebook,
  Twitter,
  Instagram,
  Send,
  Quote,
  TrendingUp,
  Glasses,
  Gift,
  Users,
  BookOpen,
  Mail,
  Bell,
  Star,
  CheckCircle,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar: string;
  authorBio: string;
  publishDate: string;
  readTime: string;
  category: string;
  tags: string[];
  featuredImage: string;
  views: number;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  publishDate: string;
  likes: number;
  isLiked?: boolean;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [emailSubscribe, setEmailSubscribe] = useState("");

  const categories: Category[] = [
    { id: "about-us", name: "Về chúng tôi", color: "bg-blue-500" },
    { id: "eye-care", name: "Chăm sóc mắt", color: "bg-green-500" },
    {
      id: "glasses-knowledge",
      name: "Kiến thức mắt kính",
      color: "bg-purple-500",
    },
    { id: "promotions", name: "Khuyến mãi", color: "bg-orange-500" },
  ];

  const mockPost: BlogPost = {
    id: "1",
    title: "10 Cách Bảo Vệ Mắt Khỏi Ánh Sáng Xanh Từ Màn Hình",
    excerpt:
      "Trong thời đại số hóa, việc bảo vệ mắt khỏi tác hại của ánh sáng xanh từ các thiết bị điện tử trở nên vô cùng quan trọng.",
    content: `
      <h2>1. Hiểu về ánh sáng xanh và tác hại</h2>
      <p>Ánh sáng xanh (blue light) là một phần của quang ph�� ánh sáng nhìn thấy được, có bước sóng từ 400-500 nanometer. Mặc dù ánh sáng xanh tự nhiên từ mặt trời có lợi cho cơ thể, nhưng ánh sáng xanh nhân tạo từ các thiết bị điện tử có thể gây ra nhiều vấn đề cho mắt.</p>

      <blockquote>"Tiếp xúc quá nhiều với ánh sáng xanh có thể dẫn đến mỏi mắt, khô mắt, và ảnh hưởng đến giấc ngủ." - BS. Nguyễn Văn Minh</blockquote>

      <h2>2. Sử dụng kính lọc ánh sáng xanh</h2>
      <p>Kính lọc ánh sáng xanh là giải pháp đơn giản và hiệu quả nhất. Các loại kính này được thiết kế đặc biệt để giảm thiểu lượng ánh sáng xanh đến mắt.</p>

      <h2>3. Áp dụng quy tắc 20-20-20</h2>
      <p>Mỗi 20 phút, hãy nhìn vào một vật ở khoảng cách 20 feet (6 m��t) trong 20 giây. Điều này giúp mắt nghỉ ngơi và giảm căng thẳng.</p>

      <h2>4. Điều chỉnh độ sáng màn hình</h2>
      <p>Đảm bảo độ sáng màn hình phù hợp với môi trường xung quanh. Màn hình quá sáng hoặc quá tối đều có thể gây mỏi mắt.</p>

      <h2>5. Sử dụng chế độ Night Mode</h2>
      <p>Hầu hết các thiết bị hiện đại đều có chế đ��� Night Mode hoặc Blue Light Filter. Hãy bật tính năng này, đặc biệt vào buổi tối.</p>

      <h2>6. Duy trì khoảng cách phù hợp</h2>
      <p>Giữ khoảng cách ít nhất 50-60cm từ mắt đến màn hình máy tính, và 30-40cm với điện thoại và tablet.</p>

      <h2>7. Tăng cường b��� sung dinh dưỡng</h2>
      <p>Vitamin A, C, E và các chất chống oxy hóa như lutein và zeaxanthin có thể giúp bảo vệ mắt khỏi tác hại của ánh sáng xanh.</p>

      <h2>8. Đảm bảo độ ẩm cho mắt</h2>
      <p>Sử dụng nước nhỏ mắt nhân tạo khi cảm thấy khô mắt. Cũng nên đảm bảo độ ẩm trong phòng làm việc.</p>

      <h2>9. Nghỉ ngơi đầy đủ</h2>
      <p>Ngủ đủ giấc và tránh sử dụng thiết bị điện tử ít nhất 1 giờ trước khi đi ngủ để não và mắt có thời gian nghỉ ngơi.</p>

      <h2>10. Khám mắt định kỳ</h2>
      <p>Thăm khám mắt định kỳ 6 tháng/lần để phát hiện sớm các vấn đề về mắt và được tư vấn phù hợp từ chuyên gia.</p>
    `,
    author: "BS. Nguyễn Văn Minh",
    authorAvatar:
      "https://images.pexels.com/photos/12807364/pexels-photo-12807364.png",
    authorBio:
      "Bác sĩ chuyên khoa mắt với hơn 15 năm kinh nghiệm trong lĩnh vực chăm sóc và điều trị các bệnh lý về mắt. Hiện đang công tác tại Bệnh viện Mắt TÂM ĐỨC.",
    publishDate: "2024-01-20",
    readTime: "5 phút",
    category: "eye-care",
    tags: ["Chăm sóc mắt", "Ánh sáng xanh", "Công nghệ", "Sức khỏe"],
    featuredImage:
      "https://images.pexels.com/photos/29457406/pexels-photo-29457406.jpeg",
    views: 15420,
    likes: 342,
    comments: 28,
    isLiked: false,
    isBookmarked: false,
  };

  const mockComments: Comment[] = [
    {
      id: "1",
      author: "Nguyễn Thị Hoa",
      avatar:
        "https://images.pexels.com/photos/12807364/pexels-photo-12807364.png",
      content:
        "Bài viết rất hữu ích! Tôi đã bắt đầu áp dụng quy tắc 20-20-20 và thấy mắt đỡ mỏi hơn rất nhiều.",
      publishDate: "2024-01-21",
      likes: 12,
      isLiked: false,
    },
    {
      id: "2",
      author: "Trần Văn Nam",
      avatar:
        "https://images.pexels.com/photos/12807364/pexels-photo-12807364.png",
      content:
        "Cảm ơn bác sĩ đã chia sẻ. Cho tôi hỏi loại kính lọc ánh sáng xanh nào tốt nhất ạ?",
      publishDate: "2024-01-21",
      likes: 8,
      isLiked: false,
    },
    {
      id: "3",
      author: "Lê Thị Mai",
      avatar:
        "https://images.pexels.com/photos/12807364/pexels-photo-12807364.png",
      content:
        "Tôi làm việc với máy tính cả ngày, bài viết này rất cần thiết. Đã save lại để đọc lại!",
      publishDate: "2024-01-22",
      likes: 15,
      isLiked: true,
    },
  ];

  const mockRelatedPosts: BlogPost[] = [
    {
      id: "2",
      title: "Hướng Dẫn Chọn Kính Cận Phù Hợp Với Khuôn Mặt",
      excerpt:
        "Việc chọn được một cặp kính cận vừa đẹp vừa phù hợp với khuôn mặt không phải lúc nào cũng dễ dàng.",
      content: "",
      author: "Chuyên gia Trần Thị Lan",
      authorAvatar:
        "https://images.pexels.com/photos/12807364/pexels-photo-12807364.png",
      authorBio: "",
      publishDate: "2024-01-18",
      readTime: "7 phút",
      category: "glasses-knowledge",
      tags: ["Hướng dẫn", "Kính cận"],
      featuredImage:
        "https://images.pexels.com/photos/5752282/pexels-photo-5752282.jpeg",
      views: 12840,
      likes: 286,
      comments: 34,
    },
    {
      id: "3",
      title: "Các Vitamin Thiết Yếu Cho Sức Khỏe Đôi Mắt",
      excerpt:
        "Dinh dưỡng đóng vai trò quan trọng trong việc duy trì sức khỏe đôi mắt.",
      content: "",
      author: "Dược sĩ Phạm Thu Hà",
      authorAvatar:
        "https://images.pexels.com/photos/12807364/pexels-photo-12807364.png",
      authorBio: "",
      publishDate: "2024-01-14",
      readTime: "6 phút",
      category: "eye-care",
      tags: ["Sức khỏe", "Vitamin"],
      featuredImage:
        "https://images.pexels.com/photos/9742773/pexels-photo-9742773.jpeg",
      views: 8320,
      likes: 167,
      comments: 22,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setPost(mockPost);
    setComments(mockComments);
    setRelatedPosts(mockRelatedPosts);
    setIsLiked(mockPost.isLiked || false);
    setIsBookmarked(mockPost.isBookmarked || false);
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryById = (id: string) => {
    return categories.find((cat) => cat.id === id);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (post) {
      setPost({ ...post, likes: isLiked ? post.likes - 1 : post.likes + 1 });
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || "";

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${url}`,
          "_blank",
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
          "_blank",
        );
        break;
      default:
        navigator.clipboard.writeText(url);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: "Bạn",
        avatar:
          "https://images.pexels.com/photos/12807364/pexels-photo-12807364.png",
        content: newComment,
        publishDate: new Date().toISOString().split("T")[0],
        likes: 0,
        isLiked: false,
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribe:", emailSubscribe);
    setEmailSubscribe("");
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  const category = getCategoryById(post.category);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Trang chủ</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/blog">Blog</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1">
                  {post.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Article Header */}
      <section className="py-8 lg:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <Badge className={`${category?.color} text-white`}>
                {category?.name}
              </Badge>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishDate)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{post.views.toLocaleString()} lượt xem</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-gray-900">
              {post.title}
            </h1>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-t border-b border-gray-200">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`${isLiked ? "text-red-500" : ""} text-xs sm:text-sm`}
                >
                  <Heart
                    className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${isLiked ? "fill-current" : ""}`}
                  />
                  {post.likes}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBookmark}
                  className={`${isBookmarked ? "text-blue-500" : ""} text-xs sm:text-sm`}
                >
                  <BookmarkPlus
                    className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${isBookmarked ? "fill-current" : ""}`}
                  />
                  <span className="hidden sm:inline">Lưu</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">
                    {post.comments} bình luận
                  </span>
                  <span className="sm:hidden">{post.comments}</span>
                </Button>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-xs text-gray-500 mr-2">Chia sẻ:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare("facebook")}
                  className="p-1 sm:p-2"
                >
                  <Facebook className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare("twitter")}
                  className="p-1 sm:p-2"
                >
                  <Twitter className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare("copy")}
                  className="p-1 sm:p-2"
                >
                  <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Article Content */}
            <div className="lg:col-span-3">
              {/* Featured Image */}
              <div className="aspect-video rounded-lg lg:rounded-xl overflow-hidden mb-6 lg:mb-8">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Body */}
              <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>

              {/* Tags */}
              <div className="mt-6 lg:mt-8 pt-6 lg:pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Thẻ bài viết
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs sm:text-sm hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Author Bio */}
              <Card className="mt-6 lg:mt-8 border-0 shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-bold text-lg mb-4">Về tác giả</h3>
                  <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                    <Avatar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto sm:mx-0">
                      <AvatarImage src={post.authorAvatar} alt={post.author} />
                      <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="font-bold text-base sm:text-lg mb-2">
                        {post.author}
                      </h4>
                      <p className="text-gray-600 text-sm sm:text-base mb-4">
                        {post.authorBio}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs sm:text-sm"
                        >
                          <User className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          Xem profile
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs sm:text-sm"
                        >
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          Liên hệ
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <div className="mt-8 lg:mt-12">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                  Bình luận ({comments.length})
                </h2>

                {/* Comment Form */}
                <Card className="mb-6 sm:mb-8 border-0 shadow-lg">
                  <CardContent className="p-4 sm:p-6">
                    <form
                      onSubmit={handleCommentSubmit}
                      className="space-y-3 sm:space-y-4"
                    >
                      <Textarea
                        placeholder="Chia sẻ suy nghĩ của bạn về bài viết..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                      />
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          size="sm"
                          className="text-xs sm:text-sm"
                        >
                          <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          Gửi bình luận
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Comments List */}
                <div className="space-y-4 sm:space-y-6">
                  {comments.map((comment) => (
                    <Card key={comment.id} className="border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={comment.avatar}
                              alt={comment.author}
                            />
                            <AvatarFallback>
                              {comment.author.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-semibold">
                                {comment.author}
                              </span>
                              <span className="text-sm text-gray-500">
                                {formatDate(comment.publishDate)}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3">
                              {comment.content}
                            </p>
                            <div className="flex items-center space-x-4">
                              <Button variant="ghost" size="sm">
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                {comment.likes}
                              </Button>
                              <Button variant="ghost" size="sm">
                                Trả lời
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Newsletter */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg">Đăng ký nhận tin</h3>
                    <p className="text-gray-600 text-sm">
                      Nhận những bài viết mới nhất về chăm sóc mắt
                    </p>
                    <form onSubmit={handleSubscribe} className="space-y-3">
                      <Input
                        type="email"
                        placeholder="Email của bạn"
                        value={emailSubscribe}
                        onChange={(e) => setEmailSubscribe(e.target.value)}
                        className="bg-white"
                      />
                      <Button type="submit" className="w-full">
                        <Bell className="w-4 h-4 mr-2" />
                        Đăng ký
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>

              {/* Related Posts */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-6 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                    Bài viết liên quan
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        to={`/blog/${relatedPost.id}`}
                        className="block group"
                      >
                        <div className="flex space-x-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={relatedPost.featuredImage}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm leading-tight group-hover:text-blue-600 transition-colors mb-2">
                              {relatedPost.title}
                            </h4>
                            <div className="flex items-center space-x-3 text-xs text-gray-500">
                              <span>{formatDate(relatedPost.publishDate)}</span>
                              <span>{relatedPost.readTime}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Table of Contents */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
                    Mục lục
                  </h3>
                  <div className="space-y-2 text-sm">
                    <a
                      href="#"
                      className="block text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      1. Hiểu về ánh sáng xanh và tác hại
                    </a>
                    <a
                      href="#"
                      className="block text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      2. Sử dụng kính lọc ánh sáng xanh
                    </a>
                    <a
                      href="#"
                      className="block text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      3. Áp dụng quy tắc 20-20-20
                    </a>
                    <a
                      href="#"
                      className="block text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      4. Điều chỉnh độ sáng màn hình
                    </a>
                    <a
                      href="#"
                      className="block text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      5. Sử dụng chế độ Night Mode
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Button variant="outline" asChild>
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Về trang blog
              </Link>
            </Button>
            <Button asChild>
              <Link to="/blog/next-post">
                Bài tiếp theo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogDetail;
