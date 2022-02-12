import { Button, Card, Col, Form, Input, List, message, Row } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { orderBy } from "lodash";
import React, { useEffect, useState } from 'react';
import firebase from "./config";

const taskRef = firebase.firestore().collection("tasks")

function App() {
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [tasks, setTasks] = useState([]);

  const onFinish = (task) => {
    if(task?.id){
      taskRef.doc(task.id).update(task).then(()=>{
        form.resetFields();
        setIsEdit(false);
        message.success("Task updated successfully")
      })
    }else{
      const id = taskRef.doc().id;
    const data = {
      ...task,
      id,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      completed: false,
    }

    taskRef.doc(id).set(data, {merge: true}).then(()=>{
      form.resetFields();
      message.success("Task has been created successfully!")

    })
    }
  }

  const getTasks = () => {
    const unSub = taskRef.onSnapshot((snapshot) => {
      const taskList = [];
      if(snapshot){
        snapshot.docs.map((doc)=> taskList.push(doc.data()));
      }
      setTasks(taskList);
    })
    return () => unSub();
  }

  const handleCompleted = (task) => {
    taskRef.doc(task.id).update({completed: !task.completed}).then(()=> message.success("Task completed!"))
  }

  const handleEdit = (item) => {
    setIsEdit(true);
    form.setFieldsValue(item)
  }

  const handleReset = () => {
    if(isEdit){
      setIsEdit(false);
    }
    form.resetFields();
  }

  const handleDelete = (id) => {
    taskRef.doc(id).delete().then(()=>message.success("Task deleted successfully"))
  }

  const renderTaskList = () => {
    const orderedTasks = orderBy(tasks, "completed", "asc")
    return (
      <List
      header={<div>Task List</div>}
      bordered
      dataSource={orderedTasks}
      renderItem={item => (
        <List.Item actions={
          [
            <Checkbox key="completed" checked={item?.completed} onChange={() => handleCompleted(item)}/>,
            <a key="edit" onClick={() => handleEdit(item)}>Edit</a>,
            <a key="delete" onClick={() => handleDelete(item.id)}>Delete</a>
          ]
        }>
          <List.Item.Meta 
            title={<span style={{fontWeight: item?.completed ? "" : "bold", color: item?.completed ? "green": "red"}}>{item.title}</span>}
            description={item.description}/>

        </List.Item>
      )}
    />
    )
  }

  useEffect(() => {
    getTasks()
  }, [])

  return (
    <div style={{position:"relative",    
      marginTop:30,
      paddingRight:"10%",
      paddingLeft:"10%"}}>
      <h1>To do app</h1>
      <Row gutter={12}>
        <Col span={8}>
            <Card title={isEdit ? "Edit task":"Add task"} style={{borderWidth:1.5}}>
              <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item name="id" hidden/>
                <Form.Item name="title" label="Title" rules={[{required: true}]}>
                  <Input/>
                </Form.Item>
                <Form.Item name="description" label="Description" rules={[{required: true}]}>
                  <Input/>
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" >
                    Submit
                  </Button>
                  <Button htmlType="button" onClick={handleReset} style={{
                      margin: '0 8px',
                    }}>{isEdit ? "Cancel" : "Reset"}</Button> 
               
                </Form.Item>
              </Form>
            </Card>
        </Col>
        <Col span={16}>
          {renderTaskList()}
        </Col>
      </Row>
    </div>
  );
}

export default App;
