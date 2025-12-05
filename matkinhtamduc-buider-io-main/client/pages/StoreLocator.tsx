import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Navigation as NavigationIcon, 
  Search,
  Star,
  Eye,
  Calendar
} from "lucide-react";

const StoreLocator = () => {
  const [selectedCity, setSelectedCity] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const stores = [
    {
      id: 1,
      name: "Mắt Kính Tâm Đức - Nguyễn Huệ",
      address: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
      phone: "028 3822 1234",
      city: "hcm",
      district: "Quận 1",
      hours: "8:00 - 21:00",
      services: ["Khám mắt", "Đo độ", "Sửa chữa"],
      rating: 4.9,
      reviews: 234,
      isNew: false,
      hasEyeExam: true,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Mắt Kính Tâm Đức - Đống Đa",
      address: "456 Phố Thái Hà, Quận Đống Đa, Hà Nội",
      phone: "024 3512 5678",
      city: "hanoi",
      district: "Đống Đa",
      hours: "8:30 - 20:30",
      services: ["Khám mắt", "Đo độ", "Bảo hành"],
      rating: 4.8,
      reviews: 189,
      isNew: true,
      hasEyeExam: true,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      name: "Mắt Kính Tâm Đức - Hải Châu",
      address: "789 Đường Hùng Vương, Quận Hải Châu, Đà Nẵng",
      phone: "0236 3888 9999",
      city: "danang",
      district: "Hải Châu",
      hours: "8:00 - 20:00",
      services: ["Đo độ", "Sửa chữa", "Bảo hành"],
      rating: 4.7,
      reviews: 145,
      isNew: false,
      hasEyeExam: false,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
    },
    // Add more stores...
  ];

  const cities = [
    { id: "all", name: "Tất cả thành phố" },
    { id: "hcm", name: "TP. Hồ Chí Minh" },
    { id: "hanoi", name: "Hà Nội" },
    { id: "danang", name: "Đà Nẵng" },
    { id: "cantho", name: "Cần Thơ" },
    { id: "haiphong", name: "Hải Phòng" },
  ];

  const filteredStores = stores.filter(store => {
    const matchesCity = selectedCity === "all" || store.city === selectedCity;
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCity && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <MapPin className="h-16 w-16 mx-auto mb-6 text-white/90" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Tìm Cửa Hàng
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Hệ thống cửa hàng Mắt Kính Tâm Đức trên toàn quốc - Gần bạn, phục vụ bạn
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm theo tên cửa hàng hoặc địa chỉ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {cities.map((city) => (
                <Button
                  key={city.id}
                  variant={selectedCity === city.id ? "default" : "outline"}
                  onClick={() => setSelectedCity(city.id)}
                  className="text-sm"
                >
                  {city.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-1">100+</div>
              <div className="text-sm text-gray-600">Cửa hàng</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">63</div>
              <div className="text-sm text-gray-600">Tỉnh thành</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">1M+</div>
              <div className="text-sm text-gray-600">Khách hàng</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-1">4.8★</div>
              <div className="text-sm text-gray-600">Đánh giá TB</div>
            </div>
          </div>
        </div>
      </section>

      {/* Store List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Danh Sách Cửa Hàng ({filteredStores.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStores.map((store) => (
              <Card key={store.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="md:flex">
                  <div className="md:w-1/3 relative">
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-full h-48 md:h-full object-cover"
                    />
                    {store.isNew && (
                      <Badge className="absolute top-3 left-3 bg-green-500">
                        Mới
                      </Badge>
                    )}
                    {store.hasEyeExam && (
                      <Badge className="absolute top-3 right-3 bg-blue-500">
                        <Eye className="h-3 w-3 mr-1" />
                        Khám mắt
                      </Badge>
                    )}
                  </div>
                  <CardContent className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 flex-1">
                        {store.name}
                      </h3>
                      <div className="flex items-center text-yellow-400 ml-2">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{store.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">({store.reviews})</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{store.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{store.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">Hàng ngày: {store.hours}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {store.services.map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <NavigationIcon className="h-3 w-3 mr-1" />
                        Chỉ đường
                      </Button>
                      {store.hasEyeExam && (
                        <Button size="sm" variant="outline" className="flex-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          Đặt lịch
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          {filteredStores.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy cửa hàng
              </h3>
              <p className="text-gray-600">
                Thử thay đổi từ khóa tìm kiếm hoặc chọn thành phố khác
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bản Đồ Cửa Hàng
            </h2>
            <p className="text-gray-600">
              Xem vị trí các cửa hàng trên bản đồ
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Bản đồ sẽ được tích hợp ở đây</p>
                <p className="text-sm text-gray-400">Google Maps / OpenStreetMap</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Phone className="h-12 w-12 mx-auto mb-6 text-white/90" />
          <h2 className="text-3xl font-bold mb-4">
            Cần Hỗ Trợ Tìm Cửa Hàng?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Gọi hotline để được tư vấn và chỉ đường đến cửa hàng gần nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Gọi ngay: 1800 1234
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              Chat với tư vấn viên
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StoreLocator;
