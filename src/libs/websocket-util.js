let instance = null;
export default {
    instance,
    init (userId) {
        // 判断当前浏览器是否支持WebSocket
        if ('WebSocket' in window) {
            instance = new WebSocket('ws://localhost:9000/api/socketServer/' + userId);

            // 连接成功建立的回调方法
            instance.onopen = evt => {
                //  setMessageInnerHTML("WebSocket连接成功");
                console.log(evt);
            };

            // 连接发生错误的回调方法
            instance.onerror = evt => {
                //  setMessageInnerHTML("WebSocket连接发生错误");
                console.log(evt);
            };

            // 接收到消息的回调方法
            instance.onmessage = evt => {
                // setMessageInnerHTML(event.data);
                console.log(evt);
            };

            // 连接关闭的回调方法
            instance.onclose = evt => {
                // setMessageInnerHTML("WebSocket连接关闭");
                console.log(evt);
            };

            // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
            window.onbeforeunload = evt => {
                close();
            };
        } else {
            alert('当前浏览器 Not support websocket');
        }
    },
    close () {
        console.log();
        instance.close();
    }
};
