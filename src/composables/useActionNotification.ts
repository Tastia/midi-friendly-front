export const useActionNotification = (loadingMessage: string) => {
  const { messageApi } = useReactifiedApi();
  const message = messageApi.create(loadingMessage, {
    type: "loading",
    duration: 0,
  });

  const setSuccess = (successMessage: string) => {
    message.type = "success";
    message.content = successMessage;
    setTimeout(() => message.destroy(), 3000);
  };

  const setError = (errorMessage: string) => {
    message.type = "error";
    message.content = errorMessage;
    setTimeout(() => message.destroy(), 3000);
  };

  const close = () => message.destroy();

  return { setSuccess, setError, close };
};
