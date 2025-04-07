"use client";

import React, { createContext, useContext, useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";

export const NOTIFICATION_TYPES = {
  ALERT: "alert",
  ALERT_DIALOG: "alertDialog",
  TOAST: "toast",
};

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    if (notification.type === NOTIFICATION_TYPES.ALERT) {
      setNotifications((prev) =>
        prev.filter((n) => n.type !== NOTIFICATION_TYPES.ALERT)
      );
    }
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    setNotifications((prev) => [...prev, newNotification]);

    if (notification.type === NOTIFICATION_TYPES.ALERT) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
      <NotificationContainer
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </NotificationContext.Provider>
  );
}

function NotificationContainer({ notifications, removeNotification }) {
  return (
    <>
      {/* Global Alerts (no inline) */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 space-y-2">
        {notifications
          .filter(
            (n) => n.type === NOTIFICATION_TYPES.ALERT && !n.displayInline
          )
          .map((n) => (
            <Alert
              key={n.id}
              variant="destructive"
              onClick={() => removeNotification(n.id)}
            >
              <AlertTitle>{n.title}</AlertTitle>
              <AlertDescription>{n.description}</AlertDescription>
            </Alert>
          ))}
      </div>

      {/* Toasts globales en top-right */}
      <ToastProvider>
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications
            .filter((n) => n.type === NOTIFICATION_TYPES.TOAST)
            .map((n) => (
              <Toast
                key={n.id}
                duration={n.duration}
                variant={n.variant}
                style={
                  n.variant === "success"
                    ? { background: "rgb(88,155,44)", color: "#fff" }
                    : n.variant === "destructive"
                      ? {
                          background: "hsl(var(--destructive))",
                          color: "hsl(var(--destructive-foreground))",
                        }
                      : undefined
                }
                onOpenChange={(open) => {
                  if (!open) removeNotification(n.id);
                }}
              >
                <div className="flex flex-col">
                  <ToastTitle>
                    {n.variant === "destructive" ? "Alerta" : n.title}
                  </ToastTitle>
                  <ToastDescription>
                    {n.variant === "destructive" ? (
                      <>
                        Porfavor dirijase a{" "}
                        <span className="underline">FAQ</span>
                      </>
                    ) : (
                      n.description
                    )}
                  </ToastDescription>
                </div>
                {n.action ? n.action : null}
              </Toast>
            ))}
        </div>
        <ToastViewport className="!fixed !top-4 !right-4 !z-50" />
      </ToastProvider>

      {/* Alert Dialogs */}
      {notifications
        .filter((n) => n.type === NOTIFICATION_TYPES.ALERT_DIALOG)
        .map((n) => (
          <AlertDialog
            key={n.id}
            open
            onOpenChange={(open) => {
              if (!open) removeNotification(n.id);
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{n.title}</AlertDialogTitle>
                <AlertDialogDescription>{n.description}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => removeNotification(n.id)}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    n.onConfirm && n.onConfirm();
                    removeNotification(n.id);
                  }}
                >
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ))}
    </>
  );
}

export { NotificationContainer };
