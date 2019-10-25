import React, { useState, useEffect } from 'react';
import { Text ,View,Modal} from 'react-native';
import firebase from "react-native-firebase";
import {
  Col,
  Grid,
  Toast,
  Button,
  ListItem,
  Input,
  List,
  Item,
  Label,
  Switch,
} from "native-base";
import DateTimePicker from "react-native-modal-datetime-picker";

const Edit: () => React$Node = (props) => {
  const [openTimePicker,setOpenTimePicker] = useState(false);
  const [powerSwitch,setpowerSwitch] = useState(props.navigation.getParam("item").power);
  const [label,setLabel] = useState(props.navigation.getParam("item").label);
  const [timeStart , setTimeStart] = useState('');
  const [timeEnd , setTimeEnd] = useState('');
  const [currentType, setCurrentType] = useState('');
  useEffect(() => {
    
  }, [])
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
        let key = props.navigation.getParam("item").key
        console.log(key)
        firebase.database().ref(`TX3 Mini/Timer/`+`${key}`).update({
          "key" : key,          
          label : label,
          start : timeStart != '' ? timeStart : props.navigation.getParam('item').start,
          end : timeEnd != '' ? timeEnd : props.navigation.getParam('item').end,          
          power : powerSwitch,          
        }).then(()=>{
          props.navigation.goBack()
        })
      }
  }
  return (
    <>
      <List >
      <ListItem>
        <Item style={{borderColor:'transparent'}} fixedLabel>              
        <Label>Tên nhãn:</Label>
                <Input onChangeText={(text)=>setLabel(text)}  placeholder={props.navigation.getParam("item").label} />
        </Item>
      </ListItem>
        <ListItem onPress={() => showDateTimePicker('start')} >
          <Label>Thời gian bắt đầu hiện tại: {timeStart == '' ?  props.navigation.getParam("item").start : timeStart} </Label>
        </ListItem>
        <ListItem onPress={() => showDateTimePicker('end')} >
          <Label>Thời gian kết thúc hiện tại: {timeEnd=='' ?props.navigation.getParam("item").end : timeEnd}</Label>
        </ListItem>
        <ListItem>
          <Label>Trạng thái hiện tại:</Label>
          <Switch onChange={(ref)=>{setpowerSwitch(ref.nativeEvent.value)}} value={powerSwitch} />
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
  )

};

Edit.navigationOptions = {
  title: 'Chỉnh sửa thời gian',
};

export default Edit;
