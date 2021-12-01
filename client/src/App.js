import _ from 'lodash';
import 'semantic-ui-css/semantic.min.css';

import React, { Component } from 'react'
import { Form, Container, Dropdown, Button, Grid, Segment, Dimmer, Loader, Icon } from 'semantic-ui-react';
import { Table } from 'react-bootstrap';


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            availableProducts: [],
            selectedProduct: {
                _id: '',
                customerName: '',
                qty: '',
                rate: '',
                totalAmount: '',
                netAmount: '',
                discountPercentage: '',
                unit: '',
            },
            masterCart: [],
        };
    }


    resetCart = () => {
        return this.setState({
            masterCart: [],
            selectedProduct: {
                _id: '',
                customerName: '',
                qty: '',
                rate: '',
                totalAmount: '',
                netAmount: '',
                discountPercentage: '',
                unit: '',
            }
        })
    }


    getOptions = () => {
        const tempProducts = this.state.availableProducts;
        return _.map(tempProducts, (state, index) => ({
            key: index,
            text: state.product_name,
            value: state._id,
        }))
    }

    fectchProducts = () => {
        fetch("http://localhost:5000/api/product/all")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        availableProducts: [...result.data]
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    componentDidMount() {
        this.fectchProducts();
    }

    calculateAmount = () => {
        console.log('here ...');
        const product = JSON.parse(JSON.stringify(this.state.selectedProduct));
        const tamnt = product.rate * product.qty;
        const netAmount = product.rate * product.qty - 1;
        this.setState(prevState => ({
            selectedProduct: {
                ...prevState.selectedProduct,
                totalAmount: tamnt, netAmount: netAmount
            }
        }));

    }
    handleInputChange = (e, { value }) => {
        const tempProducts = this.state.availableProducts;
        let productSelected = tempProducts.find(item => item._id === value);
        productSelected.qty = 1;
        productSelected.discountPercentage = 0;
        productSelected.netAmount = productSelected.qty * productSelected.rate;
        productSelected.totalAmount = productSelected.qty * productSelected.rate;
        this.setState({ selectedProduct: productSelected });
        console.log(this.state.selectedProduct);
        // this.calculateAmount();
    }
    handleSubmit = () => {
        const tempData = JSON.parse(JSON.stringify(this.state.selectedProduct));
        this.setState({ masterCart: [...this.state.masterCart, tempData] });
    }

    handleInputChangeFor = (e) => {

        this.setState(prevState => ({
            selectedProduct: {
                ...prevState.selectedProduct,
                [e.target.name]: e.target.value
            }
        }));
        if (e.target.name === 'qty' || e.target.name === 'discountPercentage') {
            this.calculateAmount();
        }
        // this.calculateAmount();
    }
    removeItem = (token) => {
        this.setState({
            masterCart: this.state.masterCart.filter((_, i) => _._id !== token)
        });
    }


    submitData = () => {
        async function postData(url = '', data = {}) {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache', 
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                   
                },
                redirect: 'follow', 
                referrerPolicy: 'no-referrer', 
                body: JSON.stringify(data)
            });
            return response.json(); 
        }

        const tempData = JSON.parse(JSON.stringify(this.state.selectedProduct));

        postData('http://localhost:5000/api/invoice/generate', {
            product_id: tempData._id,
            unit: tempData.unit,
            rate: tempData.rate,
            qty: tempData.qty,
            discountPercentage: tempData.discountPercentage,
            netAmount: tempData.netAmount,
            totalAmount: tempData.totalAmount,
            name: tempData.customerName
        })
            .then(data => {
                console.log(data); // JSON data parsed by `data.json()` call
                this.resetCart();
            })
    }

    render() {
        const { isLoaded, selectedProduct, masterCart } = this.state

        return (
            <div>
                <Container>

                    <Dimmer active={ isLoaded }>
                        <Loader/>
                    </Dimmer>
                    <Grid columns={ 1 }>
                        <Grid.Column>
                            <Form onSubmit={ this.handleSubmit }>
                                <Form.Field inline>
                                    <label>Name</label>
                                    <input placeholder='Name' name="customerName" value={ selectedProduct.customerName }
                                           onChange={ this.handleInputChangeFor.bind(this) }/>
                                </Form.Field>
                                <Form.Field inline>
                                    <label>Product</label>
                                    <Dropdown placeholder='Select Product' search selection
                                              options={ this.getOptions() } onChange={ this.handleInputChange }/>
                                </Form.Field>
                                <Form.Field inline>
                                    <label>Rate</label>
                                    <input placeholder='Rate' disabled value={ selectedProduct.rate }/>
                                </Form.Field>
                                <Form.Field inline>
                                    <label>Unit</label>
                                    <input type="number" name="unit" placeholder='Unit' disabled
                                           value={ selectedProduct.unit }
                                           onKeyPress={ (event) => {
                                               if (!/[0-9]/.test(event.key)) {
                                                   event.preventDefault();
                                               }
                                           } }
                                    />
                                </Form.Field>
                                <Form.Field inline>
                                    <label>Qty.</label>
                                    <input type="number" name="qty" min="1" max={ selectedProduct.unit }
                                           value={ selectedProduct.qty }
                                           onChange={ this.handleInputChangeFor.bind(this) }
                                           placeholder='Quantity'/>
                                </Form.Field>
                                <Form.Field inline>
                                    <label>discountPercentagecount (%)</label>
                                    <input type="number" name="discountPercentage" min="0" max="100"
                                           value={ selectedProduct.discountPercentage }
                                           onChange={ this.handleInputChangeFor.bind(this) }
                                           placeholder='discountPercentagecount'/>
                                </Form.Field>
                                <Form.Field inline>
                                    <label>Net Amount</label>
                                    <input placeholder='Net Amount' name="netAmount"
                                           value={ selectedProduct.netAmount } disabled/>
                                </Form.Field>
                                <Form.Field inline>
                                    <label>Total Amount</label>
                                    <input placeholder='Total Amount' name="totalAmount"
                                           value={ selectedProduct.totalAmount } disabled/>
                                </Form.Field>
                                <Button.Group floated='right'>
                                    <Button type='submit'
                                            disabled={ selectedProduct.customerName === undefined || selectedProduct.customerName.length < 3 }>Submit</Button>
                                </Button.Group>
                            </Form>
                        </Grid.Column>
                    </Grid>
                    <Grid columns={ 1 }>
                        <Grid.Column>
                            <br/><br/><br/><br/>
                            <div>

                                <div style={ { marginLeft: 10, marginRight: 50 } }>
                                    <Table striped bordered hover>
                                        <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Rate</th>
                                            <th>Unit</th>
                                            <th>Quantity</th>
                                            <th>discountPercentagec%</th>
                                            <th>Net Amount</th>
                                            <th>Total Amount</th>
                                            <th>Action</th>
                                        </tr>
                                        </thead>
                                        { masterCart.map((curr, i) => {
                                            return (
                                                <tbody key={ i }>
                                                <tr>
                                                    <td>
                                                        <Dropdown placeholder={ selectedProduct.product_name }
                                                                  disabled
                                                                  options={ this.getOptions() }/>
                                                    </td>
                                                    <td>{ curr.rate }</td>
                                                    <td>{ curr.unit }</td>
                                                    <td>{ curr.qty }</td>
                                                    <td>{ curr.discountPercentage }</td>
                                                    <td>{ curr.netAmount }</td>
                                                    <td>{ curr.totalAmount }</td>
                                                    <td><Button basic color='red'
                                                                onClick={ () => this.removeItem(curr._id) }>
                                                        remove
                                                    </Button></td>
                                                </tr>

                                                </tbody>
                                            )
                                        }) }
                                    </Table>
                                    <Button.Group floated='right'>
                                        <Button basic color='blue' onClick={ () => this.submitData() }>
                                            Submit
                                        </Button>
                                    </Button.Group>

                                </div>

                            </div>
                        </Grid.Column>
                    </Grid>
                </Container>
            </div>
        )
    }
}
