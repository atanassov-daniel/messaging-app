import { Component, createRef } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
//!!!! with the current implementation if I delete a message from the DB it will suddenly disappear from the page too

import { Skeleton, Card, Avatar, Image } from 'antd';
// import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';
const { Meta } = Card;

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: "AIzaSyBg39vkJc3CaI-J6bnevQPMPILG8PWmzyI",
    authDomain: "slack-app-1d097.firebaseapp.com",
    projectId: "slack-app-1d097",
    storageBucket: "slack-app-1d097.appspot.com",
    messagingSenderId: "222925739959",
    appId: "1:222925739959:web:afcdf3e05cf61fa02e7a32"
});

let db = firebase.firestore();

class Messages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            messages: [],
        };

        this.firstElFromBatch = createRef();
    }

    unsubs = [];

    componentDidMount() {
        /* this.unsubscribe = db.collection(`teams/#codewithsimran/channels/#general/posts`)
            .orderBy('createdAt', 'desc')
            .onSnapshot((querySnapshot) => {
                const messages = [];
                querySnapshot.forEach(doc => {
                    const id = doc.id;
                    doc = doc.data();
                    doc.key = id;
                    const createdAt = doc.createdAt.toDate();
                    const date = `${createdAt.getHours()}:${createdAt.getMinutes()}, ${createdAt.toGMTString().split(', ')[1].split(' ').splice(0, 3).join(' ')}`;
                    doc.createdAt = date;

                    messages.push(doc);
                });

                messages.reverse();

                if (this.state.messages.length === 0) {
                    this.setState((prevState) => ({ messages: messages }));
                    document.getElementById('first-column').scrollTop = document.getElementById('first-column').scrollHeight; // so that only on the first fetch of the messages the messages container will get automatically scrolled to its very bottom
                } else this.setState((prevState) => ({ messages: messages }));
                this.setState({ loading: false });
                console.log(this.state.messages);
            }); */

        const unsubscribe = db.collection(`teams/#codewithsimran/channels/#general/posts`)
            .orderBy('createdAt', 'desc')
            .limit(3)
            /* .get()
            .then((querySnapshot) => { */
            .onSnapshot((querySnapshot) => {
                this.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
                console.log(querySnapshot.docs.length);

                const messages = [];
                querySnapshot.forEach(doc => {
                    const id = doc.id;
                    doc = doc.data();
                    doc.key = id;
                    const createdAt = doc.createdAt.toDate();
                    const date = `${createdAt.getHours()}:${createdAt.getMinutes()}, ${createdAt.toGMTString().split(', ')[1].split(' ').splice(0, 3).join(' ')}`;
                    doc.createdAt = date;

                    messages.push(doc);
                });

                messages.reverse();

                if (this.state.messages.length === 0) {
                    // this.setState(({ messages: prevMessages }) => ({ messages: [...messages, ...prevMessages] }));
                    this.setState((prevState) => ({ messages: messages }));
                    document.getElementById('first-column').scrollTop = document.getElementById('first-column').scrollHeight; // so that only on the first fetch of the messages the messages container will get automatically scrolled to its very bottom
                } else
                    this.setState((prevState) => ({ messages: messages }));
                // this.setState(({ messages: prevMessages }) => ({ messages: [...messages, ...prevMessages] }));
                this.setState({ loading: false });
                console.log(this.state.messages);
            });

        this.unsubs.push(unsubscribe);

        setTimeout(() => {
            console.log('after 10 000 seconds');

            db.collection(`teams/#codewithsimran/channels/#general/posts`)
                .orderBy('createdAt', 'desc')
                .startAfter(this.lastVisible)
                .limit(3)
                /* .get()
                .then((querySnapshot) => { */
                .onSnapshot((querySnapshot) => {
                    console.log(querySnapshot.docs.length);

                    // this.lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1].id;
                    const messages = [];
                    // let firstMessage;
                    querySnapshot.forEach((doc, index) => {
                        const id = doc.id;
                        // if (index === 0) firstMessage = id;
                        doc = doc.data();
                        doc.key = id;
                        const createdAt = doc.createdAt.toDate();
                        const date = `${createdAt.getHours()}:${createdAt.getMinutes()}, ${createdAt.toGMTString().split(', ')[1].split(' ').splice(0, 3).join(' ')}`;
                        doc.createdAt = date;

                        messages.push(doc);
                    });

                    messages.reverse();

                    if (this.state.messages.length === 0) {
                        this.setState(({ messages: prevMessages }) => ({ messages: [...messages, ...prevMessages] }));
                        // this.setState((prevState) => ({ messages: messages }));
                        document.getElementById('first-column').scrollTop = document.getElementById('first-column').scrollHeight; // so that only on the first fetch of the messages the messages container will get automatically scrolled to its very bottom
                    } else
                        this.setState(({ messages: prevMessages }) => ({ messages: [...messages, ...prevMessages] }));
                    // this.setState((prevState) => ({ messages: messages }));
                    this.setState({ loading: false });
                    console.log(messages);
                });
        }, 10000);
        /* setTimeout(() => {
            console.log('20000');
            this.unsubs[0]();
        }, 20000); */
    }

    componentWillUnmount() {
        // !!!!!!!!!!!!!!!!!!! if I don't unsubscribe from the Firestore listener, after the unmounting of the component it keeps on working and giving me updates and leads to React giving me the following warning in the console: 
        //* index.js:1 Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.
        // this.unsubscribe();
    }

    render() {
        const skeletonInitialLoad = (
            // <Card className="loading">
            <Skeleton loading={true} avatar active className="loading" />
            // </Card>
        );

        const { loading } = this.state;

        return (
            <>
                {this.state.messages.length === 0 ? Array(5).fill(skeletonInitialLoad) : this.state.messages.map(message => (
                    <Card
                        key={message.key}
                        className={loading ? 'loading' : ''}
                    /* actions={[
                        <SettingOutlined key="setting" />,
                        <EditOutlined key="edit" />,
                        <EllipsisOutlined key="ellipsis" />,
                    ]} */
                    >
                        <Skeleton loading={loading} avatar active>
                            <Meta
                                avatar={
                                    <Avatar src={message.createdBy?.profilePicture || 'https://t4.ftcdn.net/jpg/02/51/95/53/240_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg'} shape="square" size={45} alt="user profile image" />
                                }
                                title={message?.createdBy?.name}
                                description={message.createdAt}
                            />

                            <p>{message.text}</p>

                            {
                                message.images ?
                                    <Image.PreviewGroup>
                                        {message.images.map((img, index) => (
                                            <Image
                                                key={`${message.key}//${index}`}
                                                // width={200}
                                                src={img}
                                                alt="message image"
                                            // maxInlineSize: '-webkit-fill-available'
                                            />
                                        ))}
                                    </Image.PreviewGroup>
                                    : ''
                            }
                        </Skeleton>
                    </Card>
                ))}
            </>
        );
    }
}

export default Messages;