import UserNotifications
import OneSignalExtension

class NotificationService: UNNotificationServiceExtension {
  private var receivedRequest: UNNotificationRequest!
  private var bestAttemptContent: UNMutableNotificationContent?
  private var contentHandler: ((UNNotificationContent) -> Void)?

  override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
    receivedRequest = request
    self.contentHandler = contentHandler
    bestAttemptContent = request.content.mutableCopy() as? UNMutableNotificationContent
    if let bestAttemptContent {
      OneSignalExtension.didReceiveNotificationExtensionRequest(request, with: bestAttemptContent, withContentHandler: contentHandler)
    }
  }

  override func serviceExtensionTimeWillExpire() {
    if let bestAttemptContent, let contentHandler {
      OneSignalExtension.serviceExtensionTimeWillExpireRequest(receivedRequest, with: bestAttemptContent)
      contentHandler(bestAttemptContent)
    }
  }
}
