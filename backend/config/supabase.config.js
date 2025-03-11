
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Cliente para autenticação anônima
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Cliente com chave de serviço para operações administrativas
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

module.exports = {
  supabaseClient,
  supabaseAdmin
};
