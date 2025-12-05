import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Award,
  Eye,
  Heart,
  Shield,
  Star,
  MapPin,
  Calendar,
  Phone,
  Mail,
  CheckCircle,
  Target,
  Lightbulb,
  Handshake,
  Clock,
  TrendingUp,
} from "lucide-react";

const About = () => {
  const milestones = [
    {
      year: "2008",
      title: "Khởi nghiệp",
      description: "Thành lập cửa hàng đầu tiên tại quận 1, TP.HCM",
    },
    {
      year: "2012",
      title: "Mở rộng",
      description: "Khai trương chi nhánh thứ 2 và đầu tư máy móc hiện đại",
    },
    {
      year: "2016",
      title: "Công nghệ mới",
      description: "Đưa vào sử dụng hệ thống khám mắt 3D tiên tiến",
    },
    {
      year: "2020",
      title: "Digital transformation",
      description: "Ra mắt hệ thống đặt lịch online và tư vấn từ xa",
    },
    {
      year: "2024",
      title: "Hiện tại",
      description: "3 chi nhánh, phục vụ hơn 50,000 khách hàng",
    },
  ];

  const teamMembers = [
    {
      name: "Bác sĩ Nguyễn Văn Minh",
      position: "Giám đốc & Bác sĩ nhãn khoa",
      experience: "20+ năm kinh nghiệm",
      description:
        "Chuyên gia hàng đầu về khúc xạ mắt và các bệnh lý thị giác phức tạp",
      image: "/placeholder.svg",
      credentials: ["Bác sĩ CKI Nhãn khoa", "Thành viên Hội Nhãn khoa VN"],
    },
    {
      name: "Thạc sĩ Trần Thị Hoa",
      position: "Trưởng phòng Kỹ thuật",
      experience: "15+ năm kinh nghiệm",
      description:
        "Chuyên gia về đo khúc xạ và thiết kế tròng kính cá nhân hóa",
      image: "/placeholder.svg",
      credentials: ["Thạc sĩ Quang học", "Chứng chỉ Zeiss OptiConsult"],
    },
    {
      name: "Kỹ sư Lê Văn Tuấn",
      position: "Chuyên viên Công nghệ",
      experience: "10+ năm kinh nghiệm",
      description:
        "Chuyên về các thiết bị đo lường hiện đại và công nghệ tròng kính",
      image: "/placeholder.svg",
      credentials: ["Kỹ sư Cơ khí Chính xác", "Chứng chỉ Hoya MiYOSMART"],
    },
    {
      name: "Nguyễn Thị Mai",
      position: "Trưởng phòng Tư vấn",
      experience: "12+ năm kinh nghiệp",
      description: "Chuyên gia tư vấn phong cách và lựa chọn gọng kính phù hợp",
      image: "/placeholder.svg",
      credentials: ["Chuyên viên Tư vấn thời trang", "Chứng chỉ Ray-Ban"],
    },
  ];

  const values = [
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Chuyên nghiệp",
      description:
        "Đội ngũ bác sĩ và kỹ thuật viên được đào tạo bài bản, có kinh nghiệm lâu năm trong ngành",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Tận tâm",
      description:
        "Luôn đặt khách hàng làm trung tâm, quan tâm đến từng nhu cầu và mong muốn của khách hàng",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Chất lượng",
      description:
        "Cam kết chỉ sử dụng sản phẩm chính hãng từ các thương hiệu uy tín trên thế giới",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Chính xác",
      description:
        "Sử dụng công nghệ và thiết bị hiện đại nhất để đảm bảo độ chính xác tối đa",
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Đổi mới",
      description:
        "Không ngừng cập nhật xu hướng mới, công nghệ mới để mang đến trải nghiệm tốt nhất",
    },
    {
      icon: <Handshake className="h-8 w-8" />,
      title: "Tin cậy",
      description:
        "Xây dựng mối quan hệ lâu dài với khách hàng dựa trên sự tin tưởng và minh bạch",
    },
  ];

  const achievements = [
    {
      icon: <Award className="h-12 w-12 text-primary" />,
      title: "Top 10 cửa hàng kính uy tín",
      subtitle: "TP.HCM 2023",
      description: "Được bình chọn bởi hiệp hội bán lẻ Việt Nam",
    },
    {
      icon: <Star className="h-12 w-12 text-primary" />,
      title: "Chứng nhận ISO 9001:2015",
      subtitle: "Quản lý chất lượng",
      description: "Đạt tiêu chuẩn quốc tế về hệ thống quản lý chất lượng",
    },
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: "50,000+ khách hàng",
      subtitle: "Tin tưởng & hài lòng",
      description: "Phục vụ thành công hàng chục nghìn khách hàng",
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-primary" />,
      title: "Đối tác chính thức",
      subtitle: "Ray-Ban, Oakley, Gucci",
      description: "Được ủy quyền bán hàng chính thức từ các thương hiệu lớn",
    },
  ];

  const facilities = [
    {
      name: "Chi nhánh Quận 1",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      area: "200m²",
      features: [
        "Phòng khám mắt chuyên khoa",
        "Khu trưng bày 500+ mẫu kính",
        "Phòng cắt tròng tự động",
        "Khu vực tư vấn riêng tư",
      ],
      image: "/placeholder.svg",
    },
    {
      name: "Chi nhánh Quận 3",
      address: "456 Võ Văn Tần, Quận 3, TP.HCM",
      area: "150m²",
      features: [
        "Thiết bị đo mắt hiện đại",
        "Showroom thương hiệu cao cấp",
        "Dịch vụ sửa chữa nhanh",
        "Không gian thoải mái",
      ],
      image: "/placeholder.svg",
    },
    {
      name: "Chi nhánh Thủ Đức",
      address: "789 Võ Văn Ngân, TP.Thủ Đức, TP.HCM",
      area: "180m²",
      features: [
        "Công nghệ AI đo mắt",
        "Khu vực trẻ em chuyên biệt",
        "Dịch vụ giao hàng tận nơi",
        "Parking miễn phí",
      ],
      image: "/placeholder.svg",
    },
  ];

  const statistics = [
    {
      number: "16",
      label: "Năm kinh nghiệm",
      icon: <Clock className="h-6 w-6" />,
    },
    {
      number: "50K+",
      label: "Khách hàng",
      icon: <Users className="h-6 w-6" />,
    },
    { number: "3", label: "Chi nhánh", icon: <MapPin className="h-6 w-6" /> },
    { number: "98%", label: "Hài lòng", icon: <Star className="h-6 w-6" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-50"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="w-fit">Thành lập từ 2008</Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Chuyên gia chăm sóc{" "}
                  <span className="text-primary">thị giác</span> hàng đầu
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Với hơn 16 năm kinh nghiệm, Mắt Kính Tâm Đức đã trở thành địa
                  chỉ tin cậy của hàng chục nghìn khách hàng trong việc chăm sóc
                  sức khỏe mắt và lựa chọn kính phù hợp.
                </p>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {statistics.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2 text-primary">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link to="/contact">
                    <Mail className="mr-2 h-5 w-5" />
                    Liên hệ tư vấn
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/eye-exam">
                    <Calendar className="mr-2 h-5 w-5" />
                    Đặt lịch khám
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-green-200 to-emerald-300 rounded-3xl overflow-hidden">
                <img
                  src="/placeholder.svg"
                  alt="Mắt Kính Tâm Đức"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-white p-4 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Eye className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Khám mắt miễn phí</div>
                    <div className="text-sm text-gray-600">Chuyên nghiệp</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Chất lượng đảm bảo</div>
                    <div className="text-sm text-gray-600">Chính hãng 100%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Tầm nhìn & Sứ mệnh
            </h2>
            <p className="text-xl text-gray-600">
              Định hướng phát triển và cam kết của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Tầm nhìn</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Trở thành chuỗi cửa hàng kính mắt hàng đầu Việt Nam, được
                  khách hàng tin tưởng và lựa chọn bởi chất lượng dịch vụ xuất
                  sắc, sản phẩm chính hãng và đội ngũ chuyên nghiệp. Chúng tôi
                  hướng tới mục tiêu mở rộng ra toàn quốc và trở thành thương
                  hiệu đáng tin cậy trong lĩnh vực chăm sóc mắt.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Sứ mệnh</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Mang đến cho khách hàng những sản phẩm kính mắt chất lượng
                  cao, dịch vụ chăm sóc mắt chuyên nghiệp và trải nghiệm mua sắm
                  tuyệt vời. Chúng tôi cam kết bảo vệ và cải thiện thị lực của
                  khách hàng bằng công nghệ hiện đại, kiến thức chuyên môn sâu
                  rộng và sự tận tâm trong từng dịch vụ.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-xl text-gray-600">
              Những nguyên tắc định hướng mọi hoạt động của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Hành trình phát triển
            </h2>
            <p className="text-xl text-gray-600">
              Những cột mốc quan trọng trong 16 năm hoạt động
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-green-200"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div
                    className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8"}`}
                  >
                    <Card className="p-6">
                      <CardContent className="p-0">
                        <div className="text-2xl font-bold text-primary mb-2">
                          {milestone.year}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white"></div>

                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Đội ngũ chuyên gia
            </h2>
            <p className="text-xl text-gray-600">
              Những người mang đến dịch vụ chăm sóc mắt tốt nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">
                    {member.position}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    {member.experience}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    {member.description}
                  </p>

                  <div className="space-y-1">
                    {member.credentials.map((cred, credIndex) => (
                      <Badge
                        key={credIndex}
                        variant="secondary"
                        className="text-xs mr-1"
                      >
                        {cred}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Cơ sở vật chất
            </h2>
            <p className="text-xl text-gray-600">
              Hệ thống cửa hàng hiện đại với trang thiết bị tiên tiến
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={facility.image}
                    alt={facility.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-xl">{facility.name}</h3>
                    <Badge variant="secondary">{facility.area}</Badge>
                  </div>

                  <div className="flex items-start mb-4">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-1 shrink-0" />
                    <p className="text-sm text-gray-600">{facility.address}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Tiện nghi nổi bật:</h4>
                    <ul className="space-y-1">
                      {facility.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <CheckCircle className="h-3 w-3 text-primary mr-2 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Thành tựu & Chứng nhận
            </h2>
            <p className="text-xl text-gray-600">
              Những ghi nhận và chứng nhận uy tín trong ngành
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-0">
                  <div className="flex justify-center mb-4">
                    {achievement.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">
                    {achievement.title}
                  </h3>
                  <p className="text-primary font-medium mb-3">
                    {achievement.subtitle}
                  </p>
                  <p className="text-sm text-gray-600">
                    {achievement.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Trải nghiệm dịch vụ chuyên nghiệp cùng chúng tôi
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Hãy đến với Mắt Kính Tâm Đức để được tư vấn và chăm sóc mắt bởi đội
            ngũ chuyên gia hàng đầu
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/eye-exam">
                <Calendar className="mr-2 h-5 w-5" />
                Đặt lịch khám mắt
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
              asChild
            >
              <Link to="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Hotline: 0123 456 789
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
