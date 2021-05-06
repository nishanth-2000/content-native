import React, { Component } from 'react'
import { Text, View, StyleSheet, SafeAreaView, Button, TextInput } from 'react-native'
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';

export default class SignUp extends Component {

    constructor(props) {
        super(props)

        this.state = {
            users: [],
            id: "",
            name: "",
            email: "",
            mobile: "",
            password: "",
            is_active: "true"
        }

        this.validator = new SimpleReactValidator();
    }

    componentDidMount = () => {
        this.fetchUserDetails()
    }

    fetchUserDetails = async () => {
        fetch('http://b0fc7e185cc3.ngrok.io/api/v1/users')
            .then(response => response.json())
            .then(data => this.setState({
                id: JSON.stringify(data.result.length)
            }))
            .catch((err) => {
                Alert.alert("please refresh");
                console.log(err);
            })
    }

    submitForm = () => {

        if (this.validator.allValid()) {
            this.getUser();
        }
        else {
            // loginComp.validator.showMessageFor('name');
            // loginComp.validator.showMessageFor('password');
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    getUser = async () => {

        axios.post('http://b0fc7e185cc3.ngrok.io/api/v1/users/',
            {
                id: this.state.id,
                name: this.state.name,
                email: this.state.email,
                mobile: this.state.mobile,
                password: this.state.password,
                is_active: this.state.is_active
            })
            .then((response) => {
                let login = this;
                console.log(response);
                if (response.status === 200) {
                    // localStorage.setItem("user_details", JSON.stringify(response.data.result))
                    login.props.navigation.navigate('Dashboard', { id: response.data.result.id })

                } else {
                    login.setState({ header: 'invalid' });
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {
        return (
            <SafeAreaView>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        Signup

                </Text>
                    {/* {this.state.header.length > 0 ? <Text style={{ color: 'red' }}>Invalid Credentials</Text> : null} */}
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
                        placeholder="email"
                        value={this.state.email}
                        onChangeText={(text) => {
                            this.setState({ email: text })
                            this.validator.showMessageFor("email")
                        }}
                    // onBlur={this.validator.showMessageFor("name")}
                    />
                    <Text style={{ color: 'red' }}>
                        {this.validator.message('email', this.state.email, 'required|email')}
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="mobileNumber"
                        value={this.state.mobile}
                        onChangeText={(text) => {
                            this.setState({ mobile: text })
                            this.validator.showMessageFor("mobile")
                        }}
                    // onBlur={this.validator.showMessageFor("name")}
                    />
                    <Text style={{ color: 'red' }}>
                        {this.validator.message('mobile', this.state.mobile, 'required|phone|max:10')}
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
                    <Button style={styles.button} title="SignUp" onPress={this.submitForm} ></Button>
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
