"use client"

import { useState } from "react"
import { BarChart3, Download, Calendar, TrendingUp, DollarSign, Building, Users, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import DashboardLayout from "@/components/dashboard-layout"

const revenueData = [
  { month: "ጃንዩወሪ / Jan", revenue: 2450000, target: 2500000 },
  { month: "ፌብሩወሪ / Feb", revenue: 2680000, target: 2500000 },
  { month: "ማርች / Mar", revenue: 2320000, target: 2500000 },
  { month: "ኤፕሪል / Apr", revenue: 2890000, target: 2500000 },
  { month: "ሜይ / May", revenue: 3100000, target: 2500000 },
  { month: "ጁን / Jun", revenue: 2950000, target: 2500000 },
]

const propertyPerformance = [
  {
    name: "የፀሐይ መውጫ አፓርትመንቶች / Sunrise Apartments",
    occupancy: 90,
    revenue: 450000,
    units: 20,
    trend: "up",
  },
  {
    name: "አረንጓዴ ሸለቆ ኮምፕሌክስ / Green Valley Complex",
    occupancy: 80,
    revenue: 720000,
    units: 30,
    trend: "stable",
  },
  {
    name: "የከተማ ማዕከል ፕላዛ / City Center Plaza",
    occupancy: 100,
    revenue: 600000,
    units: 15,
    trend: "up",
  },
  {
    name: "የወንዝ ዳርቻ ታወሮች / Riverside Towers",
    occupancy: 88,
    revenue: 880000,
    units: 25,
    trend: "down",
  },
]

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<any>(null)
  const [reportType, setReportType] = useState("revenue")
  const [propertyFilter, setPropertyFilter] = useState("all")

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0)
  const averageOccupancy = Math.round(
    propertyPerformance.reduce((sum, prop) => sum + prop.occupancy, 0) / propertyPerformance.length,
  )
  const totalUnits = propertyPerformance.reduce((sum, prop) => sum + prop.units, 0)

  return (
    <DashboardLayout userRole="admin" userName=" Admin Abebe" userEmail="admin@volunteer.et">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-1xl font-bold bg-gray-600 bg-clip-text text-transparent">
               Reports & Analytics
            </h1>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
               Export PDF
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
               Export Excel
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder=" Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue"> Volunteer Report</SelectItem>
              <SelectItem value="occupancy"> Engagement Rate Report</SelectItem>
              <SelectItem value="maintenance">Membership Report</SelectItem>
              <SelectItem value="payments"> Payment Report</SelectItem>
            </SelectContent>
          </Select>

          <DatePickerWithRange date={dateRange} setDate={setDateRange} placeholder=" Select date range" />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
          <CardContent className="p-4">
  <div className="flex items-center space-x-2">
    <DollarSign className="h-8 w-8 text-emerald-600" />
    <div>
      <p className="text-2xl font-bold">{(totalRevenue.toString())}</p>
      <p className="text-sm text-gray-600">Total Funds Raised</p>
    </div>
  </div>
</CardContent>

          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{averageOccupancy}%</p>
                  <p className="text-sm text-gray-600"> Volunteer Engagement Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{totalUnits}</p>
                  <p className="text-sm text-gray-600"> Total Donations Collected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">+12.5%</p>
                  <p className="text-sm text-gray-600"> Donation Growth Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Additional Reports */}
        <Card>
          <CardHeader>
            <CardTitle> Additional Reports</CardTitle>
            <CardDescription>Other available reports and analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <FileText className="h-6 w-6 text-blue-600" />
                <span className="text-sm">Payment/Donation Report</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <Users className="h-6 w-6 text-emerald-600" />
                <span className="text-sm"> Volunteer Report</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
                <Calendar className="h-6 w-6 text-purple-600" />
                <span className="text-sm"> Membership Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
