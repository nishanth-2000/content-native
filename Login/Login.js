import React, { Component } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, TextInput } from 'react-native';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';

export default class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            users: [],
            name: '',
            email: '',
            password: '',
            phoneNumber: '',
            otp: '',
            header: '',
            header2: '',
        }

        this.validator = new SimpleReactValidator();
    }

    getUser = async (num) => {
        if (num === 1) {
            console.log(this.state.name, this.state.password)

            axios.get('http://b0fc7e185cc3.ngrok.io/api/v1/users/', {
                params: {
                    name: this.state.name,
                    password: this.state.password
                }
            })
                .then((response) => {
                    let login = this;
                    console.log(response);
                    if (response.data.result.length > 0) {
                        // localStorage.setItem("user_details", JSON.stringify(response.data.result))
                        login.props.navigation.navigate('Dashboard', { id: response.data.result[0].id })

                    } else {
                        login.setState({ header: 'invalid' });
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        else {
            axios.get('http://b0fc7e185cc3.ngrok.io/api/v1/users/', {
                params: {
                    mobile: this.state.phoneNumber,
                }
            })
                .then((response) => {
                    let login = this;
                    console.log('get:', response)
                    if (response.data.result.length > 0) {
                        this.props.navigation.navigate('Dashboard')
                        // localStorage.setItem("user_details", JSON.stringify(response.data.result))
                        // login.props.history.push('/dashboard');

                    }
                    else {
                        login.setState({ header1: 'invalid' })
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }

    submitForm = () => {
        let loginComp = this;
        if (loginComp.validator.fieldValid('name') && loginComp.validator.fieldValid('password')) {
            this.getUser(1);
        }
        else {
            loginComp.validator.showMessageFor('name');
            loginComp.validator.showMessageFor('password');
        }
    }

    submitFormNum = () => {
        let loginComp = this;
        if (loginComp.validator.fieldValid('phoneNumber') && loginComp.validator.fieldValid('otp')) {
            if (loginComp.state.otp === "4040") {
                this.getUser(2);
            }
            else {
                loginComp.setState({ header2: 'invalid' })
            }
        }
        else {
            loginComp.validator.showMessageFor('phoneNumber');
        }
    }

    render() {
        this.validator.purgeFields();
        return (
            <SafeAreaView>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        Login

                    </Text>
                    {this.state.header.length > 0 ? <Text style={{ color: 'red' }}>Invalid Credentials</Text> : null}
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={this.state.name}
                        onChangeText={(text) => {
                            this.setState({ name: text })
                            this.validator.showMessageFor("name")
                        }}
                    // onBlur={this.validator.showMessageFor("name")}
                    />
                    <Text style={{ color: 'red' }}>
                        {this.validator.message('name', this.state.name, 'required')}
                    </Text>

                    <TextInput
                        style={styles.input}
                        secureTextEntry={true}
                        placeholder="Password"
                        onChangeText={(text) => {
                            this.setState({ password: text })
                            this.validator.showMessageFor("password")
                        }}
                    // onBlur={this.validator.showMessageFor("password")}
                    />
                    <Text style={{ color: 'red' }}>
                        {this.validator.message('password', this.state.password, 'required')}
                    </Text>
                    {/* <Button onPress={() =>
                        this.props.navigation.navigate('Diagnosis')
                    } title='Diagnosis'></Button> */}
                    <Button style={styles.button} title="Login" onPress={this.submitForm} ></Button>
                    <Text style={{ margin: 10 }}>OR</Text>
                    <View>
                        <Button title='SignUp' onPress={() =>
                            this.props.navigation.navigate('Signup')} />
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        padding: '20%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        flexDirection: 'row',
        width: '100%',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600'
    },
    input: {
        height: 40,
        width: "50%",
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 8,
        margin: 10,
        textAlign: 'center'
    },
    button: {
        width: "50%"
    }
});