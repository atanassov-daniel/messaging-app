import { Layout, Row, Col } from 'antd';
import { Route } from 'react-router-dom';

import './components/SiderDemo.css';

import Sidebar from './components/Sidebar/Sidebar';
import Channel from './components/Channel/Channel';
import Messages from './components/Messages/Messages';
import TextareaMessage from './components/TextareaMessage/TextareaMessage';
import Details from './components/Details';
const { Header, Content } = Layout;

function App() {
    return (
        <>
            <Header className="site-layout-background" style={{ padding: 0 }} ></Header>

            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar />

                <Layout className="site-layout" style={{ border: '5px solid red', backgroundColor: '#fff' }}>
                    <Content id="col" style={{ margin: '0', height: '100%', border: '2.5px blue solid' }}>
                        {/* <Route path="/:teamId/:channelId" component={ Channel } /> */}
                        <Route path="/details" component={Channel} />
                        {/* //!!!!!! actually it should be path="/:channel" */}

                        <Row style={{ height: '100%', width: '100%' }}>
                            <Col
                                span={24}
                                style={{ border: '2.5px solid orange', height: '60vh' }} //!! the height: '100%' broke the scrollbar's css and it wouldn't scroll
                                className="column-with-slider"
                                // id="messages-container"
                                id="first-column"
                            >
                                <Messages />
                            </Col>
                            {/* <SiderDemo /> */}

                            <Route
                                path="/details"
                                component={Details}
                            />
                        </Row>


                        <TextareaMessage />
                        
                    </Content>

                    {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
                </Layout>
            </Layout>

        </>
    );
}

export default App;