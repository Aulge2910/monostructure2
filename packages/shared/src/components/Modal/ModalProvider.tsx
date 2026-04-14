"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import Modal from ".";
import RegisterForm from "../Form/Register/RegisterForm";
import LoginForm from "../Form/Login/LoginForm";

type ModalType = "register" | "login" | "success" | null;

interface ModalContextType {
  openModal: (type: ModalType, title?: string) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalTitle, setModalTitle] = useState("");

  const openModal = useCallback(
    (type: ModalType, title: string = "Register") => {
      setActiveModal(type);
      setModalTitle(title);
    },
    [],
  );

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      <Modal
        isOpen={activeModal !== null}
        onClose={closeModal}
        title={modalTitle}
      >
        {activeModal === "register" && <RegisterForm onClose={closeModal} />}

        {activeModal === "login" && <LoginForm onClose={closeModal} />}
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
};
