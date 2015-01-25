import Q from 'q';
import jQuery from 'jquery';  // jQuery must be imported before breeze.
import breeze from 'breeze-client';

breeze.config.setQ(Q);

export default breeze;