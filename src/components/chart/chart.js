import React, { useState, useEffect } from 'react';

import {
  Text,
  View,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment'
import DateTimePicker from "react-native-modal-datetime-picker";
import firebase from 'react-native-firebase';
import {
  LineChart,
} from "react-native-chart-kit";
import { Container, Header, Content, Left, Button, Icon, Body, Title, Right } from 'native-base';

const RenderChart = (props) => {
  const yAxis = props.yAxis
  const xHour = props.xHour
  const yAxisHumidity = props.yAxisHumidity
  return (
    <>
      {yAxis.length > 0 ? <View style={{alignItems:'center'}}>
        <LineChart          
          data={{
            labels: xHour,
            datasets: [
              {
                data: yAxis,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "##5ac18e"
                },
              },
              {
                data: yAxisHumidity,
                color: (opacity = 1) => `rgba(90, 193, 142, ${opacity})`,
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "##5ac18e"
                },
              }
            ]
          }}
          width={Dimensions.get("window").width-20} // from react-native
          height={220}
          yAxisLabel={"%"}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#1488CC",
            backgroundGradientTo: "#2B32B2",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },

          }}
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
        <View>
          <Text style={{ fontSize: 18,fontStyle:'italic', alignSelf: 'center' }}>Biểu đồ nhiệt độ độ ẩm </Text>
        </View>
      </View> : <Text style={{alignSelf:"center",fontSize:18}}>Không có dữ liệu</Text>}
    </>
  );
}
const Chart: () => React$Node = (props) => {
  const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]
  const contentInset = { top: 20, bottom: 20 }
  const [currentDate, setCurrentDate] = useState('23-10-2019')
  const [xHour, setXHour] = useState([])
  const [yAxis, setYAxis] = useState([])
  const [yAxisHumidity, setYAxisHumidity] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [openTimePicker, setOpenTimePicker] = useState(false)
  const handleDatePicked = (date) => {
    let current_date = moment(date).format("DD-MM-YYYY")
    setCurrentDate(current_date)
    setIsLoaded(false)
    firebase.database().ref(`TX3 Mini/Information/` + current_date).once("value", function (snapshot) {
      let arrHour = []
      let arrTemp = []
      let arrHumidity = []
      snapshot.forEach(x => {
        arrHour.push(x.key)
        arrTemp.push(x.toJSON().Temp)
        arrHumidity.push(x.toJSON().Humidity)
      })
      setXHour(arrHour)
      setYAxis(arrTemp)
      setYAxisHumidity(arrHumidity)
    }).then(()=>{
      setIsLoaded(true)
    })
    setOpenTimePicker(false)    
  }
  const hideDateTimePicker = () => {
    setOpenTimePicker(false)
  }
  useEffect(() => {

    firebase.database().ref('TX3 Mini/Information/' + currentDate).once("value", function (snapshot) {
      let arrHour = []
      let arrTemp = []
      let arrHumidity = []
      snapshot.forEach(x => {
        arrHour.push(x.key)
        arrTemp.push(x.toJSON().Temp)
        arrHumidity.push(x.toJSON().Humidity)
      })
      setXHour(arrHour)
      setYAxis(arrTemp)
      setYAxisHumidity(arrHumidity)
    }).then(() => {
      setIsLoaded(true)
    })
  }, [])
  return (
    <>      
      <Container>
        <Header>
          <Left style={{flex:1}}>
            <Button transparent onPress={()=>props.navigation.goBack()}>
            <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body style={{flex:1.5}}>
            <View>
            <Title   onPress={()=>setOpenTimePicker(true)}>
              Ngày {currentDate}
            </Title>
            </View>
          </Body>          
          <Right style={{flex:1}}>
            <Button onPress={()=>setOpenTimePicker(true)} transparent>
              <Icon name='calendar' />
            </Button>
          </Right>
        </Header>
        <Content>
          <DateTimePicker
          isVisible={openTimePicker}
          onConfirm={handleDatePicked}
          mode="date"
          onCancel={hideDateTimePicker}
        />
        {isLoaded == true ? <RenderChart yAxisHumidity={yAxisHumidity} yAxis={yAxis} xHour={xHour} /> : <ActivityIndicator
          style={{ alignSelf: 'center' }}
          size="large"
          color="#0000ff"
        />}
        </Content>
      </Container>
    </>
  );
}
Chart.navigationOptions = {
  header : null
};
export default Chart;