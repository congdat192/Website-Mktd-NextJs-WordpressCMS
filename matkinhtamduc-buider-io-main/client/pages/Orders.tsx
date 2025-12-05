import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Package,
  Search,
  Filter,
  Eye,
  Download,
  RotateCcw,
  Star,
  Truck,
  Clock,
  CheckCircle2,
  X,
  AlertCircle,
  MapPin,
  Calendar,
  CreditCard,
  Phone,
  Mail,
  User,
  ShoppingBag,
  FileText,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Archive,
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  brand: string;
  image: string;
  variant: string;
  quantity: number;
  price: number;
  originalPrice?: number;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipping"
    | "delivered"
    | "cancelled"
    | "returned"
    | "refunded";
  total: number;
  subtotal: number;
  shippingFee: number;
  discount: number;
  paymentMethod: string;
  shippingMethod: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
  };
  items: OrderItem[];
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  notes?: string;
  canCancel: boolean;
  canReturn: boolean;
  canReorder: boolean;
}

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  const orders: Order[] = [
    {
      id: "1",
      orderNumber: "ORD001234",
      date: "2024-01-20T10:30:00",
      status: "delivered",
      total: 1850000,
      subtotal: 1800000,
      shippingFee: 50000,
      discount: 0,
      paymentMethod: "VNPay",
      shippingMethod: "Giao hàng nhanh",
      shippingAddress: {
        name: "Nguyễn Văn An",
        phone: "0901234567",
        address: "123 Đường Nguyễn Huệ",
        city: "TP. Hồ Chí Minh",
        district: "Quận 1",
        ward: "Phường Bến Nghé",
      },
      items: [
        {
          id: "1",
          name: "Kính Cận Classic Series RB5228",
          brand: "Ray-Ban",
          image:
            "https://images.pexels.com/photos/8346914/pexels-photo-8346914.jpeg",
          variant: "Đen Classic, 53mm, Chống ánh sáng xanh",
          quantity: 1,
          price: 1800000,
          originalPrice: 2100000,
        },
      ],
      trackingNumber: "VN1234567890",
      deliveredAt: "2024-01-22T14:25:00",
      canCancel: false,
      canReturn: true,
      canReorder: true,
    },
    {
      id: "2",
      orderNumber: "ORD001235",
      date: "2024-01-18T15:45:00",
      status: "shipping",
      total: 4400000,
      subtotal: 4400000,
      shippingFee: 0,
      discount: 200000,
      paymentMethod: "COD",
      shippingMethod: "Giao hàng tiêu chuẩn",
      shippingAddress: {
        name: "Nguyễn Văn An",
        phone: "0901234567",
        address: "123 Đường Nguyễn Huệ",
        city: "TP. Hồ Chí Minh",
        district: "Quận 1",
        ward: "Phường Bến Nghé",
      },
      items: [
        {
          id: "2",
          name: "Kính Râm Sport Series OO9208",
          brand: "Oakley",
          image:
            "https://images.pexels.com/photos/5766609/pexels-photo-5766609.jpeg",
          variant: "Đen Matrix, 55mm",
          quantity: 2,
          price: 2200000,
        },
      ],
      trackingNumber: "VN1234567891",
      estimatedDelivery: "2024-01-25",
      canCancel: true,
      canReturn: false,
      canReorder: true,
    },
    {
      id: "3",
      orderNumber: "ORD001233",
      date: "2024-01-15T09:20:00",
      status: "processing",
      total: 3500000,
      subtotal: 3500000,
      shippingFee: 0,
      discount: 0,
      paymentMethod: "Chuyển khoản",
      shippingMethod: "Giao hàng tiêu chuẩn",
      shippingAddress: {
        name: "Nguyễn Văn An",
        phone: "0901234567",
        address: "123 Đường Nguyễn Huệ",
        city: "TP. Hồ Chí Minh",
        district: "Quận 1",
        ward: "Phường Bến Nghé",
      },
      items: [
        {
          id: "3",
          name: "Kính Cận Luxury Collection LX4402",
          brand: "Lindberg",
          image:
            "https://images.pexels.com/photos/3773478/pexels-photo-3773478.jpeg",
          variant: "Titanium Silver, 52mm, Đa tròng Premium",
          quantity: 1,
          price: 3500000,
        },
      ],
      estimatedDelivery: "2024-01-28",
      canCancel: true,
      canReturn: false,
      canReorder: true,
    },
    {
      id: "4",
      orderNumber: "ORD001232",
      date: "2024-01-10T16:15:00",
      status: "cancelled",
      total: 2400000,
      subtotal: 2400000,
      shippingFee: 0,
      discount: 0,
      paymentMethod: "MoMo",
      shippingMethod: "Giao hàng tiêu chuẩn",
      shippingAddress: {
        name: "Nguyễn Văn An",
        phone: "0901234567",
        address: "123 Đường Nguyễn Huệ",
        city: "TP. Hồ Chí Minh",
        district: "Quận 1",
        ward: "Phường Bến Nghé",
      },
      items: [
        {
          id: "4",
          name: "Kính Cận Fashion Series FS2201",
          brand: "Gucci",
          image:
            "https://images.pexels.com/photos/8346914/pexels-photo-8346914.jpeg",
          variant: "Nâu Tortoise, 54mm",
          quantity: 1,
          price: 2400000,
        },
      ],
      notes: "Khách hàng yêu cầu hủy do thay đổi ý định",
      canCancel: false,
      canReturn: false,
      canReorder: true,
    },
  ];

  const getOrderStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          text: "Chờ xác nhận",
          color: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="w-4 h-4" />,
          description: "Đơn hàng đang chờ xác nhận từ cửa hàng",
        };
      case "confirmed":
        return {
          text: "Đã xác nhận",
          color: "bg-blue-100 text-blue-800",
          icon: <CheckCircle2 className="w-4 h-4" />,
          description: "Đơn hàng đã được xác nhận và chu��n bị xử lý",
        };
      case "processing":
        return {
          text: "Đang xử lý",
          color: "bg-indigo-100 text-indigo-800",
          icon: <RefreshCw className="w-4 h-4" />,
          description: "Đang chuẩn bị sản phẩm và đóng gói",
        };
      case "shipping":
        return {
          text: "Đang giao hàng",
          color: "bg-purple-100 text-purple-800",
          icon: <Truck className="w-4 h-4" />,
          description: "Sản phẩm đang được vận chuyển đến địa chỉ của bạn",
        };
      case "delivered":
        return {
          text: "Đã giao hàng",
          color: "bg-green-100 text-green-800",
          icon: <Package className="w-4 h-4" />,
          description: "Đơn hàng đã được giao thành công",
        };
      case "cancelled":
        return {
          text: "Đã hủy",
          color: "bg-red-100 text-red-800",
          icon: <X className="w-4 h-4" />,
          description: "Đơn hàng đã bị hủy",
        };
      case "returned":
        return {
          text: "Đã trả hàng",
          color: "bg-orange-100 text-orange-800",
          icon: <RotateCcw className="w-4 h-4" />,
          description: "Sản phẩm đã được trả lại",
        };
      case "refunded":
        return {
          text: "Đã hoàn tiền",
          color: "bg-gray-100 text-gray-800",
          icon: <Archive className="w-4 h-4" />,
          description: "Tiền đã được hoàn lại tài khoản",
        };
      default:
        return {
          text: "Không xác định",
          color: "bg-gray-100 text-gray-800",
          icon: <AlertCircle className="w-4 h-4" />,
          description: "Trạng thái không xác định",
        };
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    const matchesDate = (() => {
      if (dateFilter === "all") return true;
      const orderDate = new Date(order.date);
      const now = new Date();
      const diffTime = now.getTime() - orderDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (dateFilter) {
        case "7days":
          return diffDays <= 7;
        case "30days":
          return diffDays <= 30;
        case "90days":
          return diffDays <= 90;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleCancelOrder = (orderId: string) => {
    console.log("Cancel order:", orderId);
  };

  const handleReorder = (order: Order) => {
    console.log("Reorder:", order);
  };

  const handleTrackOrder = (trackingNumber: string) => {
    console.log("Track order:", trackingNumber);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "đ";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Breadcrumb */}
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Trang chủ
            </Link>
            <span className="text-gray-300">/</span>
            <Link to="/profile" className="text-gray-500 hover:text-gray-700">
              Tài khoản
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Đơn hàng</span>
          </div>
        </div>
      </section>

      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Lịch sử đơn hàng
              </h1>
              <p className="text-gray-600">
                Theo dõi và quản lý tất cả đơn hàng của bạn
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/profile">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại tài khoản
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm theo mã đơn hàng hoặc sản phẩm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="pending">Chờ xác nhận</SelectItem>
                  <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                  <SelectItem value="processing">Đang xử lý</SelectItem>
                  <SelectItem value="shipping">Đang giao hàng</SelectItem>
                  <SelectItem value="delivered">Đã giao hàng</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                  <SelectItem value="returned">Đã trả hàng</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thời gian</SelectItem>
                  <SelectItem value="7days">7 ngày qua</SelectItem>
                  <SelectItem value="30days">30 ngày qua</SelectItem>
                  <SelectItem value="90days">3 tháng qua</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Lọc nâng cao
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Không tìm thấy đơn hàng
                </h3>
                <p className="text-gray-600 mb-6">
                  Thử thay ��ổi bộ lọc hoặc tìm kiếm khác
                </p>
                <Button asChild>
                  <Link to="/products">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Tiếp tục mua sắm
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredOrders.map((order) => {
              const statusInfo = getOrderStatusInfo(order.status);
              return (
                <Card
                  key={order.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-xl font-bold">
                            #{order.orderNumber}
                          </h3>
                          <p className="text-gray-600">
                            {formatDate(order.date)}
                          </p>
                        </div>
                        <Badge className={statusInfo.color}>
                          {statusInfo.icon}
                          <span className="ml-1">{statusInfo.text}</span>
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatPrice(order.total)}
                        </div>
                        <p className="text-gray-600 text-sm">
                          {order.items.length} sản phẩm
                        </p>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="space-y-3 mb-6">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-blue-600 text-sm">
                              {item.brand}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {item.variant}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {formatPrice(item.price)}
                            </div>
                            <div className="text-gray-600 text-sm">
                              x{item.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-gray-600 text-sm text-center py-2 border-t">
                          ... và {order.items.length - 2} sản phẩm khác
                        </p>
                      )}
                    </div>

                    {/* Order Status & Tracking */}
                    {order.trackingNumber && order.status === "shipping" && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-purple-800">
                              Đang giao hàng
                            </h4>
                            <p className="text-purple-600 text-sm">
                              Mã vận đơn: {order.trackingNumber}
                            </p>
                            {order.estimatedDelivery && (
                              <p className="text-purple-600 text-sm">
                                Dự kiến giao:{" "}
                                {new Date(
                                  order.estimatedDelivery,
                                ).toLocaleDateString("vi-VN")}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleTrackOrder(order.trackingNumber!)
                            }
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Theo dõi
                          </Button>
                        </div>
                      </div>
                    )}

                    {order.status === "delivered" && order.deliveredAt && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-800">
                            Đã giao thành công
                          </span>
                        </div>
                        <p className="text-green-600 text-sm mt-1">
                          Giao lúc: {formatDate(order.deliveredAt)}
                        </p>
                      </div>
                    )}

                    {order.status === "cancelled" && order.notes && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-2 mb-2">
                          <X className="w-5 h-5 text-red-600" />
                          <span className="font-semibold text-red-800">
                            Đơn hàng đã bị hủy
                          </span>
                        </div>
                        <p className="text-red-600 text-sm">{order.notes}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Chi tiết
                      </Button>

                      {order.canCancel && (
                        <Button
                          variant="outline"
                          onClick={() => handleCancelOrder(order.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Hủy đơn
                        </Button>
                      )}

                      {order.canReturn && (
                        <Button variant="outline">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Trả hàng
                        </Button>
                      )}

                      {order.canReorder && (
                        <Button
                          variant="outline"
                          onClick={() => handleReorder(order)}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Mua lại
                        </Button>
                      )}

                      {order.status === "delivered" && (
                        <Button variant="outline">
                          <Star className="w-4 h-4 mr-2" />
                          Đánh giá
                        </Button>
                      )}

                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Hóa đơn
                      </Button>

                      <Button variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Hỗ trợ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            <Button variant="outline" size="sm" disabled={currentPage === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex space-x-1">
              {[1, 2, 3].map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" disabled={currentPage === 3}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </section>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Dialog open={showOrderDetail} onOpenChange={setShowOrderDetail}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Chi tiết đơn hàng #{selectedOrder.orderNumber}
              </DialogTitle>
              <DialogDescription>
                Đặt hàng lúc {formatDate(selectedOrder.date)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Order Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getOrderStatusInfo(selectedOrder.status).icon}
                    <div>
                      <h3 className="font-semibold">
                        {getOrderStatusInfo(selectedOrder.status).text}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {getOrderStatusInfo(selectedOrder.status).description}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={getOrderStatusInfo(selectedOrder.status).color}
                  >
                    {getOrderStatusInfo(selectedOrder.status).text}
                  </Badge>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Sản phẩm</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 border rounded-lg p-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-blue-600">{item.brand}</p>
                        <p className="text-gray-600 text-sm">{item.variant}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span>Số lượng: {item.quantity}</span>
                          <span className="font-semibold">
                            {formatPrice(item.price)}
                          </span>
                          {item.originalPrice && (
                            <span className="text-gray-500 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">
                    Thông tin giao hàng
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>{selectedOrder.shippingAddress.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{selectedOrder.shippingAddress.phone}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span>
                        {selectedOrder.shippingAddress.address},{" "}
                        {selectedOrder.shippingAddress.ward},{" "}
                        {selectedOrder.shippingAddress.district},{" "}
                        {selectedOrder.shippingAddress.city}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">
                    Thông tin thanh toán
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Tạm tính:</span>
                      <span>{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá:</span>
                        <span>-{formatPrice(selectedOrder.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Phí vận chuyển:</span>
                      <span>
                        {selectedOrder.shippingFee === 0
                          ? "Miễn phí"
                          : formatPrice(selectedOrder.shippingFee)}
                      </span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-blue-600">
                        {formatPrice(selectedOrder.total)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Thanh toán: {selectedOrder.paymentMethod}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  );
};

export default Orders;
