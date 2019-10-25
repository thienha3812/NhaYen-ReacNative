import React, { useState } from "react";
import {
  Text,
  View
} from "react-native";

import firebase from "react-native-firebase";
import {  
  Col,
  Grid,
  Toast, 
  Button,
  ListItem,
  List,  
  Item,
  Input,
  Label
} from "native-base";
import DateTimePicker from "react-native-modal-datetime-picker";




const Add : () => React$Node = (props) => {
  const [openTimePicker,setOpenTimePicker] = useState(false);
  const [timeStart , setTimeStart] = useState('');
  const [timeEnd , setTimeEnd] = useState('');
  const [currentType, setCurrentType] = useState('');
  const [label,setLabel] = useState('')
  const  handleDatePicked = date => {    
    if(currentType == 'start'){              
        let hour = new Date(date).getHours()
        if(hour<10){
          hour = "0"+hour
        }        
        let minute = new Date(date).getMinutes()
        if(minute<10){
          minute = "0" + minute
        }
        let time =  hour +":"+ minute        
        setTimeStart(time);
        setOpenTimePicker(false);
    }
    if(currentType == 'end'){        
        let hour = new Date(date).getHours()
        if(hour<10){
          hour = "0"+hour
        }        
        let minute = new Date(date).getMinutes()
        if(minute<10){
          minute = "0" + minute
        }
        let time =  hour +":"+ minute   
        setTimeEnd(time);
        setOpenTimePicker(false);
    }
  };
  const hideDateTimePicker = () =>{
    setOpenTimePicker(false);
  };
  const showDateTimePicker = (type) =>{
    if(type == 'start'){
      setCurrentType('start')
    }
    if(type == 'end'){
      setCurrentType('end')
    }
    setOpenTimePicker(true);
  }
  const setTime = () =>{    
    if(timeStart == '' || timeEnd == ''){
      Toast.show({
        text:'Vui lòng thiết lập đầy đủ thông tin!',
        duration : 2000,
        type : 'danger',
         position: 'bottom'
      })
    }else{
      let totalSecondStart = parseInt(timeStart.split(":")[0] * 60) + parseInt(timeStart.split(":")[1]);
      let totalSecondEnd = parseInt(timeEnd.split(":")[0] * 60) + parseInt(timeEnd.split(":")[1]);      
      if(totalSecondStart >= totalSecondEnd){
        Toast.show({
        text:'Thời gian kết thúc luôn phải lớn hơn thời gian bắt đầu!',
        duration : 4000,
        type : 'danger',
         position: 'bottom'
      })
      }else{
        let key = Math.floor(Math.random()*10000000)
        firebase.database().ref('TX3 Mini/Timer').child(key).set({
          "key" : key,
          detail : "",
          label : label,
          start : timeStart,
          end : timeEnd,
          port : props.navigation.getParam('port', 'A'),
          power : true,
          state : false
        }).then(()=>{
          props.navigation.goBack()
        })
      }

    }
  }
  return (
    <>   
    
        <List >
      <ListItem style={{border:'transparent'}} >
        <Label>Cổng đang chọn: {props.navigation.getParam('port', 'ID')}</Label>
      </ListItem>
      <ListItem>
      <Item style={{borderColor:'transparent'}} fixedLabel>              
              <Input onChangeText={(text)=>setLabel(text)} placeholder="Tên nhãn" />
            </Item>
      </ListItem>
      <ListItem onPress={ () => showDateTimePicker('start')} >
        <Label>Thời gian bắt đầu: {timeStart}</Label>
      </ListItem>
      <ListItem onPress={ () => showDateTimePicker('end')} >
        <Label>Thời gian kết thúc: {timeEnd}</Label>
      </ListItem>
    </List>
        <DateTimePicker
          isVisible={openTimePicker}
          onConfirm={handleDatePicked}
           mode="time"
          onCancel={hideDateTimePicker}
        />
    <View style={{marginTop:10,flex:1,justifyContent:'center',alignItems:'center'}}>
    <Grid>
      <Col style={{flex:0.5}}>
      <Button  onPress={setTime} rounded style={{justifyContent: 'center', textAlign: 'center',alignItems:'center'}}><Text style={{color:'white'}}>Thiết lập</Text></Button>
      </Col>
    </Grid>
    </View>
    </>
  );
}
Add.navigationOptions = {
  title : 'Thiết lập thời gian'
}
export default Add;