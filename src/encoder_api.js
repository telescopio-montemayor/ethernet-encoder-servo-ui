import io from 'socket.io-client';

import Emitter from './Emitter';


function build_auth_headers(auth={username:'', password:''}) {
  let {username, password} = auth;
  let headers = new Headers();

  if (username || password) {
    headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));
  }
  return headers;
}


class Axis extends Emitter {
  constructor (initial_state, server_path='', auth={username:'', password:''}) {
    super();
    this.$server_path = server_path;
    this.$headers = build_auth_headers(auth);
    this.$headers.append('Content-Type', 'application/json');
    this.$id = initial_state.id;
    this.$base_path = `${this.$server_path}/api/devices/${this.$id}`;
    this.state = Object.assign({}, initial_state);
  }

  async __do_action(url, payload) {
    return fetch(url, {
      method: 'PUT',
      headers: this.$headers,
      credentials: 'include',
      body: JSON.stringify(payload)
    }).then((response) => {
      return response.json();
    });
  }

  __update_state (newState) {
    this.state = Object.assign({}, this.state, newState);
    this.$emit('update', this.state);
    return this;
  }

  async update (axisData) {
    if (axisData) {
      return this.__update_state(axisData);
    }

    return fetch(this.$base_path, {headers: this.$headers, credentials: 'include'})
    .then((response) => {
      return response.json();
    }).then((axisData) => {
      return this.__update_state(axisData);
    });
  }

  async goto (target={degrees: 0, minutes: 0, seconds: 0}, options={relative: false}) {
    let unit = (target.hours !== undefined) ? 'astronomical' : 'angle';
    let url = `${this.$base_path}/goto/`;

    if (options.relative) {
      url = url + 'relative/';
    }
    url = url + unit;
    return this.__do_action(url, target)
    .then((axisData) => {
      return this.__update_state(axisData);
    });
  }

  get tracking() {
    return Boolean(this.state.tracking);
  }

  set tracking(value) {
    let url = `${this.$base_path}/tracking`;
    value = Boolean(value);
    this.__do_action(url, { 'tracking': value })
    .then((axisData) => {
      return this.__update_state(axisData);
    });
    return value;
  }

  get closed_loop() {
    return Boolean(this.state.closed_loop);
  }

  set closed_loop (value) {
    let action = value ? 'resume': 'halt';
    let url = `${this.$base_path}/${action}`;
    return this.__do_action(url, {})
    .then((axisData) => {
      return this.__update_state(axisData);
    });
  }

  halt () {
    this.closed_loop = false;
  }

  resume () {
    this.closed_loop = true;
  }
}

class EncoderApi {
  constructor (server_path='') {
    this.$server_path = server_path;
    this.$axes_by_id = {};
    this.$axes = [];
    this.online = false;
  }

  initialize (path, options={auth:{ username:'', password: '' }}) {
    let socket;

    this.finalize();

    if (path) {
      this.$server_path = path;
    }

    this.$auth = options.auth;
    this.$headers = build_auth_headers(options.auth);


    socket = this.$socket = io(this.$server_path);
    socket.on('position', (state) => {
      let axis = this.$axes_by_id[state.id];

      if (axis) {
        axis.update(state);
      } else {
        this.__add_axis(state);
      }
    });

    socket.on('connect', () => {
      this.online = true;
    });
    socket.on('disconnect', () => {
      this.online = false;
    });

    return this;
  }

  finalize () {
    let socket = this.$socket;
    if (socket) {
      socket.off('position');
      socket.off('disconnect');
      socket.off('connect');
      socket.close();
      this.online = false;
    }
  }

  async __add_axis (data) {
    let axis = this.$axes_by_id[data.id];

    if (axis) {
      axis.update(data);

    } else {
      axis = new Axis(data, this.$server_path);
      this.$axes_by_id[axis.$id] = axis;
      this.$axes.push(axis);

      axis.update();
    }
    return axis;
  }

  async getAxes () {
    return fetch(`${this.$server_path}/api/devices/`, {headers: this.$headers, credentials: 'include'})
    .then((response) => {
      return response.json();
    }).then((axisData) => {
      return axisData.map((data) => {
        return this.__add_axis(data);
      });
    });
  }
}

var api = new EncoderApi();

export default {
  install (Vue,  server_path='', options={auth:{ username:'', password: '' }}) {
    api.initialize(server_path, options);
    Vue.prototype.$encoder = api;
  }
}
