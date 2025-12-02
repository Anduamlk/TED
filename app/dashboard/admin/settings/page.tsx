"use client"

import { useState } from "react"
import { Settings, Save, Bell, Mail, Smartphone, Shield, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import DashboardLayout from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // General Settings
    systemName: " Digital Volunteer & Membership Management System",
    systemEmail: "admin@volunteer.et",
    systemPhone: "+251911234567",
    currency: "ETB",
    language: "am-en",
    timezone: "Africa/Addis_Ababa",

    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    paymentReminders: true,
    maintenanceAlerts: true,
    leaseExpiryNotices: true,

    // SMS Settings
    smsProvider: "geez",
    smsApiKey: "your-geez-api-key",
    smsTemplate: "Dear{meber_name}, {amount} {due_date}..",

    // Email Settings
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "admin@volunteer.et",
    smtpPassword: "your-app-password",

    // Security Settings
    sessionTimeout: "30",
    passwordMinLength: "8",
    requireTwoFactor: false,
    allowMultipleSessions: true,

    // Backup Settings
    autoBackup: true,
    backupFrequency: "daily",
    backupRetention: "30",
  })

  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: " Settings Saved",
      description: "System settings have been updated successfully",
    })
  }

  return (
    <DashboardLayout userRole="admin" userName=" Admin Abebe" userEmail="admin@volunteer.et">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gray-600 bg-clip-text text-transparent">
              System Settings
            </h1>
            <p className="text-gray-600 mt-1">
               Manage system configurations and preferences
            </p>
          </div>
          <Button
            onClick={handleSave}
            className="bg-red-200 hover:from-emerald-700 text-gray-800 hover:to-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
             Save Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-emerald-600" />
                <span> General Settings</span>
              </CardTitle>
              <CardDescription> Basic system information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="systemName">System Name</Label>
                <Input
                  id="systemName"
                  value={settings.systemName}
                  onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="systemEmail"> System Email</Label>
                <Input
                  id="systemEmail"
                  type="email"
                  value={settings.systemEmail}
                  onChange={(e) => setSettings({ ...settings, systemEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="systemPhone">System Phone</Label>
                <Input
                  id="systemPhone"
                  value={settings.systemPhone}
                  onChange={(e) => setSettings({ ...settings, systemPhone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency"> Currency</Label>
                <Select
                  value={settings.currency}
                  onValueChange={(value) => setSettings({ ...settings, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETB">ኢትዮጵያ ብር (ETB)</SelectItem>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">ቋንቋ / Language</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => setSettings({ ...settings, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="am-en">አማርኛ-English</SelectItem>
                    <SelectItem value="am">አማርኛ</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <span> Notification Settings</span>
              </CardTitle>
              <CardDescription>Manage notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label> Email Notifications</Label>
                  <p className="text-sm text-gray-500"> Send notifications via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label> SMS Notifications</Label>
                  <p className="text-sm text-gray-500"> Send notifications via SMS</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label> Payment Reminders</Label>
                  <p className="text-sm text-gray-500"> Send automatic payment reminders</p>
                </div>
                <Switch
                  checked={settings.paymentReminders}
                  onCheckedChange={(checked) => setSettings({ ...settings, paymentReminders: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Event Alerts</Label>
                  <p className="text-sm text-gray-500"> Send Event  alerts</p>
                </div>
                <Switch
                  checked={settings.maintenanceAlerts}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenanceAlerts: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label> Program announcement Notices</Label>
                  <p className="text-sm text-gray-500"> Send announcement notifications</p>
                </div>
                <Switch
                  checked={settings.leaseExpiryNotices}
                  onCheckedChange={(checked) => setSettings({ ...settings, leaseExpiryNotices: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* SMS Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5 text-purple-600" />
                <span> SMS Settings</span>
              </CardTitle>
              <CardDescription>SMS service configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smsProvider"> SMS Provider</Label>
                <Select
                  value={settings.smsProvider}
                  onValueChange={(value) => setSettings({ ...settings, smsProvider: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="geez">Geez SMS</SelectItem>
                    <SelectItem value="ethio-telecom">Ethio Telecom</SelectItem>
                    <SelectItem value="safaricom">Safaricom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smsApiKey">የAPI ቁልፍ / API Key</Label>
                <Input
                  id="smsApiKey"
                  type="password"
                  value={settings.smsApiKey}
                  onChange={(e) => setSettings({ ...settings, smsApiKey: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smsTemplate"> SMS Template</Label>
                <Textarea
                  id="smsTemplate"
                  value={settings.smsTemplate}
                  onChange={(e) => setSettings({ ...settings, smsTemplate: e.target.value })}
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-orange-600" />
                <span> Email Settings</span>
              </CardTitle>
              <CardDescription> SMTP email configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP/ SMTP Host</Label>
                <Input
                  id="smtpHost"
                  value={settings.smtpHost}
                  onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP/ SMTP Port</Label>
                <Input
                  id="smtpPort"
                  value={settings.smtpPort}
                  onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpUsername">Username</Label>
                <Input
                  id="smtpUsername"
                  value={settings.smtpUsername}
                  onChange={(e) => setSettings({ ...settings, smtpUsername: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPassword"> Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  value={settings.smtpPassword}
                  onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-red-600" />
                <span> Security Settings</span>
              </CardTitle>
              <CardDescription>System security configurations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout"> Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordMinLength"> Minimum Password Length</Label>
                <Input
                  id="passwordMinLength"
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) => setSettings({ ...settings, passwordMinLength: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label> Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500"> Require additional security</p>
                </div>
                <Switch
                  checked={settings.requireTwoFactor}
                  onCheckedChange={(checked) => setSettings({ ...settings, requireTwoFactor: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label> Multiple Sessions</Label>
                  <p className="text-sm text-gray-500"> Allow login on multiple devices</p>
                </div>
                <Switch
                  checked={settings.allowMultipleSessions}
                  onCheckedChange={(checked) => setSettings({ ...settings, allowMultipleSessions: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Backup Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-green-600" />
                <span> Backup Settings</span>
              </CardTitle>
              <CardDescription>Data backup configurations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label> Automatic Backup</Label>
                  <p className="text-sm text-gray-500"> Enable automatic data backup</p>
                </div>
                <Switch
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backupFrequency"> Backup Frequency</Label>
                <Select
                  value={settings.backupFrequency}
                  onValueChange={(value) => setSettings({ ...settings, backupFrequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly"> Hourly</SelectItem>
                    <SelectItem value="daily"> Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly"> Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="backupRetention"> Backup Retention (days)</Label>
                <Input
                  id="backupRetention"
                  type="number"
                  value={settings.backupRetention}
                  onChange={(e) => setSettings({ ...settings, backupRetention: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline"> Reset</Button>
          <Button
            onClick={handleSave}
            className="bg-red-300 text-gray-600 hover:from-emerald-700 hover:to-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
             Save Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
