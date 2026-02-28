export const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR").format(date);
};
