import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import firebase from 'react-native-firebase';
import {
  Container,
  Left,
  Col,
  Grid,
  Title,
  Right,
  Body,
  Header,
  Button,
  Content,
  ListItem,
  List,
  Fab,
  FooterTab,
  Footer,
  Icon,
} from 'native-base';
import styles from './style';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons  from 'react-native-vector-icons/MaterialIcons'
const RenderList: () => React$Node = props => {
  const {list,navigateToEditItem} = props;
  return list.map((x, index) => {
    return (
      <ListItem key={index} onPress={() => navigateToEditItem(x)}>
        <Grid>
          <Col style={{alignItems: 'center'}}>
            <Text>
              {x.start} - {x.end}
            </Text>
          </Col>
          <Col style={{alignItems: 'center'}}>
            <Text>{x.label}</Text>
          </Col>
          <Col style={{alignItems: 'center'}}>
            <Entypo name="light-bulb" color={x.state && "yellow"} style={{fontSize: 20}}></Entypo>
          </Col>
        </Grid>
      </ListItem>
    );
  });
};
const Home: () => React$Node = props => {
  const [listItem, setListItem] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [fabActive, setFabActive] = useState(false);
  const [disabledTabButton, setDisabledTabButton] = useState('A');
  useEffect(()=>{
    firebase.database().ref('TX3 Mini/Timer').on("child_added",function(){
      firebase
        .database()
        .ref('TX3 Mini/Timer')
        .once('value')
        .then(result => {            
          let arr = [];
          setIsLoaded(false);            
          result.forEach(x => {
            if (x.toJSON().port == disabledTabButton) {
              arr.push(x.toJSON());
            }
          });
          return arr;
        })
        .then(arr => {
          setListItem(arr);
          setIsLoaded(true);
        });
    })
    firebase
    .database()
    .ref('TX3 Mini/Timer')
    .on('child_changed', function() {        
      firebase
        .database()
        .ref('TX3 Mini/Timer')
        .once('value')
        .then(result => {            
          let arr = [];
          setIsLoaded(false);            
          result.forEach(x => {
            if (x.toJSON().port == disabledTabButton) {
              arr.push(x.toJSON());
            }
          });
          return arr;
        })
        .then(arr => {
          setListItem(arr);
          setIsLoaded(true);
        });
    });
  },[disabledTabButton])
  useEffect(() => {  
    firebase
      .database()
      .ref('TX3 Mini/Timer')
      .once('value')
      .then(result => {
        setIsLoaded(false);
        let arr = [];        
        result.forEach(x => {                  
          if (x.toJSON().port == disabledTabButton) {            
            Object.values(x.toJSON())
            arr.push(x.toJSON());
          }
        });
        return arr;
      })
      .then(arr => {
        setListItem(arr);
        setIsLoaded(true);
      });
  }, []);
  const navigateToEditItem =  (item) =>{    
    console.log(item)
    props.navigation.navigate('EditTime',{item})
  }
  const handleTabPress = value => {    
    setIsLoaded(false);
    setListItem([]);
    // Load database on click
    firebase
      .database()
      .ref('TX3 Mini/Timer')
      .once('value')
      .then(result => {
        let arr = [];
        result.forEach(x => {
          if (x.toJSON().port == value) {
            arr.push(x.toJSON());
          }
        });
        return arr
      })
      .then((arr) => {
        setListItem(arr);
        setIsLoaded(true);
        setDisabledTabButton(value);
      })
  };
  return (
    <>
      <Container>
        <Header barTintColor="#ffffcc">
          <Left style={{flex: 1}} />
          <Body style={{flex: 1}}>
            <Title style={{alignSelf: 'center'}}>Trang chủ</Title>
          </Body>
          <Right style={{flex: 1}} />
        </Header>
        <View style={{flex: 1}}>
          <Content>
            <List>
              <ListItem>
                <Grid>
                  <Col style={{alignItems: 'center'}}>
                    <Text>
                      <Entypo name="clock" style={{fontSize: 15}}></Entypo> Thời
                      gian
                    </Text>
                  </Col>
                  <Col style={{alignItems: 'center'}}>
                    <Text><MaterialIcons name="label"></MaterialIcons>Tên nhãn</Text>
                  </Col>
                  <Col style={{alignItems: 'center'}}>
                    <Text>
                      <Entypo name="light-up" style={{fontSize: 15}}></Entypo>{' '}
                      Trạng thái
                    </Text>
                  </Col>
                </Grid>
              </ListItem>
            </List>
            {isLoaded ? (
              <RenderList list={listItem} navigateToEditItem={navigateToEditItem.bind(this)} />
            ) : (
              <ActivityIndicator
                style={{alignSelf: 'center'}}
                size="large"
                color="#0000ff"
              />
            )}
          </Content>
          <Fab
            active={fabActive}
            direction="up"
            containerStyle={{}}
            style={{backgroundColor: '#5067FF'}}
            position="bottomRight"
            onPress={() => setFabActive(!fabActive)}>
            <Icon name="add" />
            <Button
              style={{backgroundColor: '#DD5144'}}
              onPress={() => {
                props.navigation.navigate('AddTime', {port: disabledTabButton});
              }}>
              <Entypo name="clock" style={{color:'white',fontSize:20}} ></Entypo>
            </Button>
            <Button onPress={()=>{
              props.navigation.navigate('Camera')
            }} style={{backgroundColor: '#3B5998'}}>
              <Icon name="camera" />
            </Button>
            <Button onPress={() =>{
              props.navigation.navigate('Chart')
            }} style={{backgroundColor: 'green'}}>
              <Entypo name="pie-chart" style={{fontSize: 20, color: 'white'}} />
            </Button>
          </Fab>
        </View>
        <Footer>
          <FooterTab>
            <Button
              disabled={disabledTabButton == 'A' ? true : false}
              onPress={() => handleTabPress('A')}>
              <Text style={styles.tabButton} active>
                Cổng A
              </Text>
            </Button>
            <Button
              disabled={disabledTabButton == 'B' ? true : false}
              onPress={() => handleTabPress('B')}>
              <Text style={styles.tabButton}>Cổng B</Text>
            </Button>
            <Button
              disabled={disabledTabButton == 'C' ? true : false}
              onPress={() => handleTabPress('C')}>
              <Text style={styles.tabButton}>Cổng C</Text>
            </Button>
            <Button
              disabled={disabledTabButton == 'D' ? true : false}
              onPress={() => handleTabPress('D')}>
              <Text style={styles.tabButton}>Cổng D</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    </>
  );
};
Home.navigationOptions = {
  header: null,
};
export default Home;
