/**
 * Oracle Fusion Cloud Data Generator for Collect.D
 * This script generates simulated data files that would be extracted from
 * Oracle Fusion Cloud for use in the Collect.D accounts receivable and
 * collections application.
 */

const fs = require('fs');
const path = require('path');

// Helper functions for data generation
function generateRandomDate(startDate, endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return new Date(start + Math.random() * (end - start)).toISOString().split('T')[0];
  }
  
  function generateID(prefix, num, padLength = 6) {
    return `${prefix}${num.toString().padStart(padLength, '0')}`;
  }
  
  function generateCompanyName(index) {
    const prefixes = ['Tata', 'Reliance', 'Infosys', 'Bharti', 'HDFC', 'Wipro', 'Mahindra', 'Birla', 'Adani', 'JSW', 'Godrej', 'L&T', 'ICICI', 'SBI', 'TCS', 'Bajaj', 'HCL', 'Hindustan', 'Indian', 'Tech'];
    const suffixes = ['Limited', 'Enterprises', 'Solutions', 'Corporation', 'Industries', 'Technologies', 'Group', 'Services', 'Pvt Ltd', 'Global', 'Systems', 'Ventures', 'Partners', 'Associates', 'Consultancy', 'Networks', 'Retail', 'Motors', 'Financials', 'Energy'];
    const mid = ['Tech', 'Info', 'Auto', 'Fin', 'Power', 'Steel', 'Textiles', 'Pharma', 'Healthcare', 'Retail', 'Media', 'Telecom', 'Software', 'Hardware', 'Food', 'Agro', 'Resources', 'Chemicals', 'Logistics', 'Infrastructure'];
    
    // Use the index to ensure uniqueness
    const prefixIndex = index % prefixes.length;
    const midIndex = Math.floor(index / prefixes.length) % mid.length;
    const suffixIndex = Math.floor(index / (prefixes.length * mid.length)) % suffixes.length;
    
    return `${prefixes[prefixIndex]} ${mid[midIndex]} ${suffixes[suffixIndex]}`;
  }
  
  function generatePersonName(index) {
    const firstNames = ['Raj', 'Amit', 'Vijay', 'Sunil', 'Anil', 'Rahul', 'Sanjay', 'Rakesh', 'Rajesh', 'Ashok', 'Priya', 'Neha', 'Pooja', 'Rani', 'Sunita', 'Anita', 'Meena', 'Kavita', 'Shalini', 'Geeta'];
    const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Verma', 'Gupta', 'Mishra', 'Joshi', 'Shah', 'Agarwal', 'Mehta', 'Reddy', 'Chopra', 'Malhotra', 'Nair', 'Rao', 'Iyer', 'Banerjee', 'Chatterjee', 'Kapoor'];
    
    const firstIndex = index % firstNames.length;
    const lastIndex = Math.floor(index / firstNames.length) % lastNames.length;
    
    return `${firstNames[firstIndex]} ${lastNames[lastIndex]}`;
  }
  
  function generateAddress(index) {
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Indore', 'Kochi', 'Nagpur', 'Bhopal', 'Surat', 'Vadodara', 'Coimbatore', 'Visakhapatnam', 'Guwahati'];
    const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Maharashtra', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Punjab', 'Madhya Pradesh', 'Kerala', 'Maharashtra', 'Madhya Pradesh', 'Gujarat', 'Gujarat', 'Tamil Nadu', 'Andhra Pradesh', 'Assam'];
    const streets = ['MG Road', 'Gandhi Nagar', 'Nehru Place', 'Connaught Place', 'Brigade Road', 'Park Street', 'Commercial Street', 'Linking Road', 'Jubilee Hills', 'Civil Lines', 'Sector 17', 'Main Road', 'Church Street', 'Marine Drive', 'Race Course Road', 'Paldi', 'Ring Road', 'Tech Park', 'Anna Salai', 'GS Road'];
    
    const cityIndex = index % cities.length;
    const streetIndex = Math.floor(index / cities.length) % streets.length;
    
    // Generate a realistic Indian PIN code (postal code)
    const pinCode = (400000 + Math.floor(Math.random() * 100000)).toString();
    
    return {
      street: `${Math.floor(Math.random() * 100) + 1}, ${streets[streetIndex]}`,
      city: cities[cityIndex],
      state: states[cityIndex],
      pinCode: pinCode
    };
  }
  
  function generateGSTNumber(state, index) {
    // State codes
    const stateCodes = {
      'Maharashtra': '27',
      'Delhi': '07',
      'Karnataka': '29',
      'Telangana': '36',
      'Tamil Nadu': '33',
      'West Bengal': '19',
      'Gujarat': '24',
      'Rajasthan': '08',
      'Uttar Pradesh': '09',
      'Punjab': '03',
      'Madhya Pradesh': '23',
      'Kerala': '32',
      'Andhra Pradesh': '37',
      'Assam': '18'
    };
    
    const stateCode = stateCodes[state] || '99';
    const panPart = 'ABCDE' + (1000 + index).toString().substring(1);
    const entityCode = '1';
    const checkDigit = 'Z';
    
    return stateCode + panPart + entityCode + 'Z' + checkDigit;
  }
  
  function generateAmount(min, max, decimal = 2) {
    return (min + Math.random() * (max - min)).toFixed(decimal);
  }
  
  function generateValueWithProbability(valuesWithProbabilities) {
    const rand = Math.random() * 100;
    let cumulativeProbability = 0;
    
    for (const [value, probability] of valuesWithProbabilities) {
      cumulativeProbability += probability;
      if (rand <= cumulativeProbability) {
        return value;
      }
    }
    
    // Default to the last value if something went wrong
    return valuesWithProbabilities[valuesWithProbabilities.length - 1][0];
  }
  
  function generateIndustrySector(index) {
    const sectors = [
      'Manufacturing', 'IT Services', 'Banking & Finance', 'Pharmaceuticals', 
      'Retail', 'Real Estate', 'Telecommunications', 'Healthcare', 
      'Automotive', 'Energy', 'Hospitality', 'Education', 
      'Media & Entertainment', 'FMCG', 'Agriculture', 'Construction'
    ];
    return sectors[index % sectors.length];
  }
  
  function generatePaymentTerms() {
    return generateValueWithProbability([
      ['Net 30', 40],
      ['Net 45', 20],
      ['Net 60', 15],
      ['Net 15', 15],
      ['Net 7', 5],
      ['COD', 5]
    ]);
  }
  
  function generateCreditLimit(companySize) {
    const limits = {
      'Small': () => generateAmount(100000, 1000000, 0),
      'Medium': () => generateAmount(1000000, 10000000, 0),
      'Large': () => generateAmount(10000000, 50000000, 0),
      'Enterprise': () => generateAmount(50000000, 200000000, 0)
    };
    
    return limits[companySize]();
  }
  
  function generateCompanySize() {
    return generateValueWithProbability([
      ['Small', 35],
      ['Medium', 40],
      ['Large', 20],
      ['Enterprise', 5]
    ]);
  }
  
  // 1. Generate Customer Master Data (1000 customers)
  function generateCustomerData() {
    const customers = [];
    for (let i = 0; i < 1000; i++) {
      const companyName = generateCompanyName(i);
      const customerID = generateID('CUST', i + 1);
      const address = generateAddress(i);
      const companySize = generateCompanySize();
      const paymentTerms = generatePaymentTerms();
      const creditLimit = generateCreditLimit(companySize);
      const gstNumber = generateGSTNumber(address.state, i);
      const industry = generateIndustrySector(i);
      const primaryContact = generatePersonName(i);
      const email = primaryContact.toLowerCase().replace(' ', '.') + '@' + companyName.toLowerCase().replace(/ /g, '') + '.com';
      const phone = `+91${Math.floor(7000000000 + Math.random() * 3000000000)}`;
      const onboardingDate = generateRandomDate('2018-01-01', '2024-12-31');
      
      customers.push({
        customer_id: customerID,
        customer_name: companyName,
        primary_contact: primaryContact,
        email: email,
        phone: phone,
        address_line1: address.street,
        city: address.city,
        state: address.state,
        postal_code: address.pinCode,
        country: 'India',
        gst_number: gstNumber,
        payment_terms: paymentTerms,
        credit_limit: creditLimit,
        available_credit: (creditLimit * (0.3 + Math.random() * 0.7)).toFixed(2),
        industry_sector: industry,
        customer_category: companySize,
        onboarding_date: onboardingDate,
        status: Math.random() > 0.05 ? 'Active' : 'Inactive'
      });
    }
    
    let customerCSV = 'customer_id,customer_name,primary_contact,email,phone,address_line1,city,state,postal_code,country,gst_number,payment_terms,credit_limit,available_credit,industry_sector,customer_category,onboarding_date,status\n';
    customers.forEach(customer => {
      customerCSV += Object.values(customer).join(',') + '\n';
    });
    
    return { customers, customerCSV };
  }
  
  // 2. Generate Invoice Data
  function generateInvoiceData(customers) {
    const invoices = [];
    const invoiceLineItems = [];
    const currentDate = new Date('2025-04-18');
  
    // Generate sales representatives
    const salesReps = [];
    for (let i = 0; i < 50; i++) {
      salesReps.push({
        rep_id: generateID('REP', i + 1),
        rep_name: generatePersonName(i + 500) // Offset to get different names
      });
    }
  
    // Define tax rates
    const taxRates = {
      'GST5': 0.05,
      'GST12': 0.12,
      'GST18': 0.18,
      'GST28': 0.28
    };
  
    // Generate multiple invoices per customer
    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];
      
      // Generate 3-8 invoices per customer
      const invoiceCount = Math.floor(3 + Math.random() * 6);
      
      for (let j = 0; j < invoiceCount; j++) {
        const invoiceID = generateID('INV', (i * 10) + j + 1, 7);
        
        // Determine the invoice date (within the last 180 days)
        const daysAgo = Math.floor(Math.random() * 180);
        const invoiceDate = new Date(currentDate);
        invoiceDate.setDate(invoiceDate.getDate() - daysAgo);
        
        // Get customer payment terms and calculate due date
        const terms = customer.payment_terms;
        const daysToAdd = parseInt(terms.replace('Net ', '')) || 30; // Default to 30 if parsing fails
        
        const dueDate = new Date(invoiceDate);
        dueDate.setDate(dueDate.getDate() + daysToAdd);
        
        // Generate random sales rep
        const salesRep = salesReps[Math.floor(Math.random() * salesReps.length)];
        
        // Calculate a realistic invoice amount based on company size
        let baseInvoiceAmount;
        switch(customer.customer_category) {
          case 'Small':
            baseInvoiceAmount = 10000 + Math.random() * 90000;
            break;
          case 'Medium':
            baseInvoiceAmount = 50000 + Math.random() * 450000;
            break;
          case 'Large':
            baseInvoiceAmount = 200000 + Math.random() * 1800000;
            break;
          case 'Enterprise':
            baseInvoiceAmount = 500000 + Math.random() * 4500000;
            break;
          default:
            baseInvoiceAmount = 50000 + Math.random() * 450000;
        }
        
        // Round to 2 decimal places
        baseInvoiceAmount = Math.round(baseInvoiceAmount * 100) / 100;
        
        // Determine tax rate based on product/service type
        const taxType = generateValueWithProbability([
          ['GST5', 20],
          ['GST12', 30],
          ['GST18', 40],
          ['GST28', 10]
        ]);
        
        const taxRate = taxRates[taxType];
        const taxAmount = baseInvoiceAmount * taxRate;
        const totalAmount = baseInvoiceAmount + taxAmount;
        
        // Determine payment status based on due date
        let paymentStatus = 'Unpaid';
        let paidAmount = 0;
        let paymentDate = null;
        
        // For invoices past their due date
        if (dueDate < currentDate) {
          // 70% chance of being fully paid if past due date
          if (Math.random() < 0.7) {
            paymentStatus = 'Paid';
            paidAmount = totalAmount;
            
            // Payment date is between invoice date and current date
            const paymentDaysAfterInvoice = Math.floor(Math.random() * (daysAgo - 5)) + 5;
            const tempPaymentDate = new Date(invoiceDate);
            tempPaymentDate.setDate(tempPaymentDate.getDate() + paymentDaysAfterInvoice);
            paymentDate = tempPaymentDate.toISOString().split('T')[0];
          } else {
            // 30% chance of being unpaid (overdue)
            paymentStatus = 'Overdue';
          }
        } else {
          // For invoices not yet due
          // 20% chance of being paid early
          if (Math.random() < 0.2) {
            paymentStatus = 'Paid';
            paidAmount = totalAmount;
            
            const daysBeforeDue = Math.floor(Math.random() * (daysToAdd - 2)) + 2;
            const tempPaymentDate = new Date(dueDate);
            tempPaymentDate.setDate(tempPaymentDate.getDate() - daysBeforeDue);
            paymentDate = tempPaymentDate.toISOString().split('T')[0];
          }
          // 10% chance of partial payment
          else if (Math.random() < 0.1) {
            paymentStatus = 'Partial';
            paidAmount = totalAmount * (0.3 + Math.random() * 0.4); // Remove toFixed here
            
            const daysBeforeDue = Math.floor(Math.random() * (daysToAdd - 2)) + 2;
            const tempPaymentDate = new Date(dueDate);
            tempPaymentDate.setDate(tempPaymentDate.getDate() - daysBeforeDue);
            paymentDate = tempPaymentDate.toISOString().split('T')[0];
          }
        }
        
        // Calculate balance
        const balanceAmount = (totalAmount - paidAmount).toFixed(2);
        
        // Create the invoice record
        invoices.push({
          invoice_id: invoiceID,
          customer_id: customer.customer_id,
          customer_name: customer.customer_name,
          invoice_date: invoiceDate.toISOString().split('T')[0],
          due_date: dueDate.toISOString().split('T')[0],
          invoice_amount: baseInvoiceAmount.toFixed(2),
          tax_amount: taxAmount.toFixed(2),
          total_amount: totalAmount.toFixed(2),
          paid_amount: paidAmount.toFixed(2), // Convert to string here
          balance_amount: balanceAmount,
          payment_status: paymentStatus,
          payment_date: paymentDate,
          payment_terms: customer.payment_terms,
          currency: 'INR',
          sales_rep_id: salesRep.rep_id,
          sales_rep_name: salesRep.rep_name,
          reference_number: `PO-${Math.floor(100000 + Math.random() * 900000)}`,
          tax_type: taxType
        });
        
        // Generate 1-5 line items per invoice
        const lineItemCount = Math.floor(1 + Math.random() * 5);
        let totalLineItemAmount = 0;
        
        for (let k = 0; k < lineItemCount; k++) {
          // The last line item will make up the difference to match the invoice amount
          let lineItemAmount;
          if (k === lineItemCount - 1) {
            lineItemAmount = baseInvoiceAmount - totalLineItemAmount;
          } else {
            // Generate a portion of the remaining amount
            const remainingAmount = baseInvoiceAmount - totalLineItemAmount;
            const portion = 0.1 + Math.random() * 0.6; // 10-70% of remaining
            lineItemAmount = remainingAmount * portion;
            totalLineItemAmount += lineItemAmount;
          }
          
          // Ensure positive value and format
          lineItemAmount = Math.max(lineItemAmount, 0).toFixed(2);
          
          const productNames = [
            'Software License', 'Consulting Services', 'Hardware Appliance', 
            'Support Contract', 'Implementation Services', 'Training Package',
            'Cloud Subscription', 'Maintenance Agreement', 'Security Solution',
            'Network Equipment'
          ];
          
          invoiceLineItems.push({
            line_item_id: generateID('ITEM', (i * 50) + (j * 5) + k + 1, 8),
            invoice_id: invoiceID,
            product_code: `PROD-${Math.floor(1000 + Math.random() * 9000)}`,
            product_description: productNames[Math.floor(Math.random() * productNames.length)],
            quantity: Math.floor(1 + Math.random() * 10),
            unit_price: (lineItemAmount / (Math.floor(1 + Math.random() * 10))).toFixed(2),
            amount: lineItemAmount,
            tax_rate: (taxRate * 100).toFixed(0) + '%',
            tax_amount: (lineItemAmount * taxRate).toFixed(2),
            total_amount: (lineItemAmount * (1 + taxRate)).toFixed(2)
          });
        }
      }
    }
  
    // Create the invoice CSV content
    let invoiceCSV = 'invoice_id,customer_id,customer_name,invoice_date,due_date,invoice_amount,tax_amount,total_amount,paid_amount,balance_amount,payment_status,payment_date,payment_terms,currency,sales_rep_id,sales_rep_name,reference_number,tax_type\n';
    invoices.forEach(invoice => {
      invoiceCSV += Object.values(invoice).join(',') + '\n';
    });
  
    // Create the invoice line items CSV content
    let invoiceLineItemsCSV = 'line_item_id,invoice_id,product_code,product_description,quantity,unit_price,amount,tax_rate,tax_amount,total_amount\n';
    invoiceLineItems.forEach(item => {
      invoiceLineItemsCSV += Object.values(item).join(',') + '\n';
    });
  
    return { invoices, invoiceLineItems, salesReps, invoiceCSV, invoiceLineItemsCSV };
  }
  
  // 3. Generate Payment Data
  function generatePaymentData(invoices) {
    const payments = [];
    const paymentMethods = ['Bank Transfer', 'Check', 'Credit Card', 'UPI', 'NEFT', 'RTGS', 'Cash', 'Digital Wallet'];
  
    invoices.forEach(invoice => {
      if (invoice.payment_status === 'Paid' || invoice.payment_status === 'Partial') {
        // Each paid or partially paid invoice has a payment record
        const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
        const paymentID = generateID('PAY', parseInt(invoice.invoice_id.replace('INV', '')), 7);
        
        payments.push({
          payment_id: paymentID,
          invoice_id: invoice.invoice_id,
          customer_id: invoice.customer_id,
          payment_date: invoice.payment_date,
          payment_amount: invoice.paid_amount,
          payment_method: paymentMethod,
          reference_number: paymentMethod === 'Check' ? 
            `CHK-${Math.floor(10000 + Math.random() * 90000)}` : 
            `REF-${Math.floor(100000 + Math.random() * 900000)}`,
          bank_account: paymentMethod.includes('Bank') || paymentMethod.includes('NEFT') || paymentMethod.includes('RTGS') ? 
            `BANK-${Math.floor(1000 + Math.random() * 9000)}` : '',
          status: 'Processed',
          notes: ''
        });
      }
    });
  
    // Create the payment CSV content
    let paymentCSV = 'payment_id,invoice_id,customer_id,payment_date,payment_amount,payment_method,reference_number,bank_account,status,notes\n';
    payments.forEach(payment => {
      paymentCSV += Object.values(payment).join(',') + '\n';
    });
  
    return { payments, paymentCSV };
  }
  
  // 4. Generate GL Entry Data
  function generateGLEntryData(invoices) {
    const glEntries = [];
    const glAccounts = {
      'AR': '120000',
      'Revenue': '400000',
      'Tax': '220000',
      'Bank': '110000',
      'Discount': '430000',
      'BadDebt': '680000'
    };
  
    // For every invoice, create GL entries
    invoices.forEach(invoice => {
      const glId = generateID('GL', parseInt(invoice.invoice_id.replace('INV', '')), 8);
      const postingDate = invoice.invoice_date;
      
      // Invoice creation entries
      glEntries.push({
        gl_entry_id: `${glId}-1`,
        posting_date: postingDate,
        document_type: 'Invoice',
        document_number: invoice.invoice_id,
        account_code: glAccounts.AR,
        account_description: 'Accounts Receivable',
        debit: invoice.total_amount,
        credit: '0.00',
        currency: 'INR',
        reference: invoice.reference_number,
        customer_id: invoice.customer_id
      });
      
      glEntries.push({
        gl_entry_id: `${glId}-2`,
        posting_date: postingDate,
        document_type: 'Invoice',
        document_number: invoice.invoice_id,
        account_code: glAccounts.Revenue,
        account_description: 'Sales Revenue',
        debit: '0.00',
        credit: invoice.invoice_amount,
        currency: 'INR',
        reference: invoice.reference_number,
        customer_id: invoice.customer_id
      });
      
      glEntries.push({
        gl_entry_id: `${glId}-3`,
        posting_date: postingDate,
        document_type: 'Invoice',
        document_number: invoice.invoice_id,
        account_code: glAccounts.Tax,
        account_description: 'Sales Tax Payable',
        debit: '0.00',
        credit: invoice.tax_amount,
        currency: 'INR',
        reference: invoice.reference_number,
        customer_id: invoice.customer_id
      });
      
      // If payment exists, create payment entries
      if (invoice.payment_status === 'Paid' || invoice.payment_status === 'Partial') {
        const paymentGlId = generateID('GL', parseInt(invoice.invoice_id.replace('INV', '')) + 10000, 8);
        
        glEntries.push({
          gl_entry_id: `${paymentGlId}-1`,
          posting_date: invoice.payment_date,
          document_type: 'Payment',
          document_number: generateID('PAY', parseInt(invoice.invoice_id.replace('INV', '')), 7),
          account_code: glAccounts.Bank,
          account_description: 'Bank Account',
          debit: invoice.paid_amount,
          credit: '0.00',
          currency: 'INR',
          reference: `Payment for ${invoice.invoice_id}`,
          customer_id: invoice.customer_id
        });
        
        glEntries.push({
          gl_entry_id: `${paymentGlId}-2`,
          posting_date: invoice.payment_date,
          document_type: 'Payment',
          document_number: generateID('PAY', parseInt(invoice.invoice_id.replace('INV', '')), 7),
          account_code: glAccounts.AR,
          account_description: 'Accounts Receivable',
          debit: '0.00',
          credit: invoice.paid_amount,
          currency: 'INR',
          reference: `Payment for ${invoice.invoice_id}`,
          customer_id: invoice.customer_id
        });
      }
    });
  
    // Create the GL entries CSV content
    let glEntriesCSV = 'gl_entry_id,posting_date,document_type,document_number,account_code,account_description,debit,credit,currency,reference,customer_id\n';
    glEntries.forEach(entry => {
      glEntriesCSV += Object.values(entry).join(',') + '\n';
    });
  
    return { glEntries, glEntriesCSV };
  }
  
  // 5. Generate Order Management Data
  function generateOrderData(invoices, customers) {
    const orders = [];
    const orderStatuses = ['Delivered', 'In Transit', 'Processing', 'Completed', 'Canceled'];
  
    // Link orders to invoices
    invoices.forEach(invoice => {
      const orderID = generateID('ORD', parseInt(invoice.invoice_id.replace('INV', '')), 7);
      
      // Order date is typically before invoice date
      const invoiceDate = new Date(invoice.invoice_date);
      const daysBeforeInvoice = Math.floor(3 + Math.random() * 14); // 3-17 days before
      const orderDate = new Date(invoiceDate);
      orderDate.setDate(orderDate.getDate() - daysBeforeInvoice);
      
      // Shipment date is between order date and invoice date
      const shipmentDaysAfterOrder = Math.floor(1 + Math.random() * (daysBeforeInvoice - 1));
      const shipmentDate = new Date(orderDate);
      shipmentDate.setDate(shipmentDate.getDate() + shipmentDaysAfterOrder);
      
      // Determine order status
      let status = 'Completed';
      if (invoice.invoice_date > new Date('2025-03-15').toISOString().split('T')[0]) {
        status = orderStatuses[Math.floor(Math.random() * 3)]; // More recent orders may still be in progress
      }
      
      const customer = customers.find(c => c.customer_id === invoice.customer_id);
      
      orders.push({
        order_id: orderID,
        customer_id: invoice.customer_id,
        invoice_id: invoice.invoice_id,
        order_date: orderDate.toISOString().split('T')[0],
        shipment_date: shipmentDate.toISOString().split('T')[0],
        order_amount: invoice.invoice_amount,
        tax_amount: invoice.tax_amount,
        total_amount: invoice.total_amount,
        status: status,
        sales_rep_id: invoice.sales_rep_id,
        currency: 'INR',
        shipping_address: customer.address_line1 + ', ' + customer.city,
        purchase_order_number: invoice.reference_number
      });
    });
  
    // Create the orders CSV content
    let ordersCSV = 'order_id,customer_id,invoice_id,order_date,shipment_date,order_amount,tax_amount,total_amount,status,sales_rep_id,currency,shipping_address,purchase_order_number\n';
    orders.forEach(order => {
      ordersCSV += Object.values(order).join(',') + '\n';
    });
  
    return { orders, ordersCSV };
  }
  
  // 6. Generate Customer Interaction Data
  function generateInteractionData(customers, invoices, salesReps) {
    const interactions = [];
    const interactionTypes = ['Call', 'Email', 'Meeting', 'Site Visit', 'Video Call', 'Web Portal', 'Chat'];
    const interactionSummaries = {
      'Collection Call': [
        'Discussed payment of overdue invoices',
        'Customer promised payment by next week',
        'Left voicemail regarding overdue payment',
        'Customer disputed invoice amount',
        'Arranged payment schedule for overdue amounts',
        'Customer confirmed payment has been initiated',
        'Explained late payment fees and implications',
        'Escalated to manager due to payment delays'
      ],
      'Account Review': [
        'Quarterly account review meeting',
        'Discussed upcoming orders and payment terms',
        'Reviewed credit limit and payment history',
        'Updated customer contact information',
        'Addressed concerns about recent shipments',
        'Negotiated new payment terms'
      ],
      'Dispute Resolution': [
        'Customer reported incorrect billing',
        'Resolved shipping discrepancy',
        'Discussed quality issues with recent shipment',
        'Processing refund for returned items',
        'Clarified invoice line items',
        'Created credit note for billing error'
      ],
      'Payment Confirmation': [
        'Received confirmation of payment transfer',
        'Verified payment receipt for invoice',
        'Confirmed check has been processed',
        'Reconciled payment with outstanding invoices',
        'Updated records with new payment details',
        'Resolved payment allocation discrepancy'
      ],
      'General Inquiry': [
        'Responded to statement request',
        'Provided account balance information',
        'Answered questions about payment methods',
        'Explained invoice details',
        'Shared payment history report',
        'Addressed questions about online portal access'
      ]
    };
  
    // Generate customer interactions (more for customers with overdue invoices)
    for (let i = 0; i < customers.length; i++) {
      const customer = customers[i];
      const customerInvoices = invoices.filter(inv => inv.customer_id === customer.customer_id);
      
      // Calculate how many interactions to generate based on overdue invoices
      const overdueInvoices = customerInvoices.filter(inv => inv.payment_status === 'Overdue');
      let interactionCount = 1 + Math.floor(Math.random() * 3); // Base 1-3 interactions
      
      if (overdueInvoices.length > 0) {
        interactionCount += Math.min(overdueInvoices.length * 2, 10); // Add more interactions for overdue invoices
      }
      
      for (let j = 0; j < interactionCount; j++) {
        const interactionDate = generateRandomDate('2024-10-01', '2025-04-18'); // Recent 6 months
        const interactionType = interactionTypes[Math.floor(Math.random() * interactionTypes.length)];
        
        // Determine interaction purpose based on invoice status
        let purpose;
        if (overdueInvoices.length > 0 && Math.random() < 0.7) {
          purpose = 'Collection Call';
        } else {
          const purposes = ['Account Review', 'Dispute Resolution', 'Payment Confirmation', 'General Inquiry'];
          purpose = purposes[Math.floor(Math.random() * purposes.length)];
        }
        
        // Get suitable summaries for this purpose
        const possibleSummaries = interactionSummaries[purpose];
        const summary = possibleSummaries[Math.floor(Math.random() * possibleSummaries.length)];
        
        // Reference relevant invoice if applicable
        let relatedInvoice = '';
        if (purpose === 'Collection Call' || purpose === 'Payment Confirmation' || purpose === 'Dispute Resolution') {
          const relevantInvoices = purpose === 'Collection Call' ? overdueInvoices : customerInvoices;
          if (relevantInvoices.length > 0) {
            relatedInvoice = relevantInvoices[Math.floor(Math.random() * relevantInvoices.length)].invoice_id;
          }
        }
        
        // Determine who initiated the interaction
        const initiatedBy = (purpose === 'Collection Call' || purpose === 'Account Review') ? 
                         'Company' : (Math.random() < 0.7 ? 'Company' : 'Customer');
        
        // Generate rep who handled the interaction
        const rep = salesReps[Math.floor(Math.random() * salesReps.length)];
        
        interactions.push({
          interaction_id: generateID('INT', (i * 10) + j + 1, 7),
          customer_id: customer.customer_id,
          customer_name: customer.customer_name,
          interaction_date: interactionDate,
          interaction_type: interactionType,
          purpose: purpose,
          summary: summary,
          initiated_by: initiatedBy,
          handled_by: rep.rep_name,
          rep_id: rep.rep_id,
          related_invoice: relatedInvoice,
          outcome: j % 3 === 0 ? 'Follow-up Required' : (j % 3 === 1 ? 'Resolved' : 'Pending'),
          notes: ''
        });
      }
    }
  
    // Create the interactions CSV content
    let interactionsCSV = 'interaction_id,customer_id,customer_name,interaction_date,interaction_type,purpose,summary,initiated_by,handled_by,rep_id,related_invoice,outcome,notes\n';
    interactions.forEach(interaction => {
      interactionsCSV += Object.values(interaction).join(',') + '\n';
    });
  
    return { interactions, interactionsCSV };
  }
  
  // 7. Generate Collection Case Data
  function generateCollectionCaseData(invoices, salesReps) {
    const collectionCases = [];
    const caseStatuses = ['Open', 'In Progress', 'Pending Customer', 'On Hold', 'Resolved', 'Escalated'];
    const priorityLevels = ['Low', 'Medium', 'High', 'Critical'];
    const collectionStrategies = ['Standard Follow-up', 'Intensive Collection', 'Legal Action Warning', 'Payment Plan', 'Settlement Offer', 'Write-off'];
  
    // Generate collection cases for overdue invoices
    invoices.filter(inv => inv.payment_status === 'Overdue').forEach((invoice, index) => {
      const invoiceDate = new Date(invoice.invoice_date);
      const dueDate = new Date(invoice.due_date);
      const currentDate = new Date('2025-04-18');
      
      // Calculate days overdue
      const daysOverdue = Math.round((currentDate - dueDate) / (1000 * 60 * 60 * 24));
      
      // Skip if not significantly overdue
      if (daysOverdue < 5) return;
      
      // Determine priority based on amount and days overdue
      let priority;
      const amount = parseFloat(invoice.balance_amount);
      
      if (amount > 1000000 || daysOverdue > 90) {
        priority = 'Critical';
      } else if (amount > 500000 || daysOverdue > 60) {
        priority = 'High';
      } else if (amount > 100000 || daysOverdue > 30) {
        priority = 'Medium';
      } else {
        priority = 'Low';
      }
      
      // Determine collection strategy
      let strategy;
      if (daysOverdue > 90) {
        strategy = Math.random() < 0.7 ? 'Legal Action Warning' : 'Settlement Offer';
      } else if (daysOverdue > 60) {
        strategy = Math.random() < 0.6 ? 'Intensive Collection' : 'Payment Plan';
      } else {
        strategy = 'Standard Follow-up';
      }
      
      // Determine case status
      let status;
      if (daysOverdue > 90) {
        status = Math.random() < 0.4 ? 'Escalated' : (Math.random() < 0.5 ? 'In Progress' : 'Pending Customer');
      } else if (daysOverdue > 60) {
        status = Math.random() < 0.6 ? 'In Progress' : (Math.random() < 0.5 ? 'Open' : 'Pending Customer');
      } else {
        status = Math.random() < 0.7 ? 'Open' : 'In Progress';
      }
      
      // Calculate a realistic case open date
      const openDaysAfterDue = Math.min(5 + Math.floor(Math.random() * 10), daysOverdue - 1);
      const openDate = new Date(dueDate);
      openDate.setDate(openDate.getDate() + openDaysAfterDue);
      
      // Assign to a collector
      const collector = salesReps[Math.floor(Math.random() * salesReps.length)];
      
      collectionCases.push({
        case_id: generateID('CASE', index + 1, 6),
        customer_id: invoice.customer_id,
        customer_name: invoice.customer_name,
        invoice_id: invoice.invoice_id,
        case_open_date: openDate.toISOString().split('T')[0],
        amount_due: invoice.balance_amount,
        days_overdue: daysOverdue,
        priority: priority,
        status: status,
        assigned_to: collector.rep_name,
        collector_id: collector.rep_id,
        collection_strategy: strategy,
        last_action_date: generateRandomDate(openDate.toISOString().split('T')[0], '2025-04-18'),
        next_action_date: status !== 'Resolved' ? generateRandomDate('2025-04-19', '2025-05-10') : '',
        resolution_date: status === 'Resolved' ? generateRandomDate(openDate.toISOString().split('T')[0], '2025-04-18') : '',
        notes: ''
      });
    });
  
    // Create the collection cases CSV content
    let collectionCasesCSV = 'case_id,customer_id,customer_name,invoice_id,case_open_date,amount_due,days_overdue,priority,status,assigned_to,collector_id,collection_strategy,last_action_date,next_action_date,resolution_date,notes\n';
    collectionCases.forEach(ccase => {
      collectionCasesCSV += Object.values(ccase).join(',') + '\n';
    });
  
    return { collectionCases, collectionCasesCSV };
  }
  
  // 8. Generate Dispute Data
  function generateDisputeData(invoices, salesReps) {
    const disputes = [];
    const disputeTypes = ['Price Discrepancy', 'Quantity Discrepancy', 'Quality Issue', 'Service Not Rendered', 'Duplicate Billing', 'Wrong Item', 'Delivery Delay', 'Contract Terms'];
    const disputeStatuses = ['Open', 'Under Investigation', 'Awaiting Customer', 'Awaiting Internal Response', 'Resolved - Accepted', 'Resolved - Rejected', 'Closed'];
  
    // Generate disputes for ~10% of invoices
    const disputeInvoices = invoices.filter(inv => Math.random() < 0.1);
  
    disputeInvoices.forEach((invoice, index) => {
      const invoiceDate = new Date(invoice.invoice_date);
      const currentDate = new Date('2025-04-18');
      
      // Skip if invoice is too recent (less than 5 days old)
      const invoiceAge = Math.round((currentDate - invoiceDate) / (1000 * 60 * 60 * 24));
      if (invoiceAge < 5) return;
      
      // Calculate a realistic dispute open date
      const openDaysAfterInvoice = Math.min(3 + Math.floor(Math.random() * 15), invoiceAge - 1);
      const openDate = new Date(invoiceDate);
      openDate.setDate(openDate.getDate() + openDaysAfterInvoice);
      
      // Determine dispute amount (typically a portion of the invoice)
      const totalAmount = parseFloat(invoice.total_amount);
      const disputeAmount = (totalAmount * (0.1 + Math.random() * 0.9)).toFixed(2);
      
      // Determine dispute type
      const disputeType = disputeTypes[Math.floor(Math.random() * disputeTypes.length)];
      
      // Determine status based on age of dispute
      const disputeAge = Math.round((currentDate - openDate) / (1000 * 60 * 60 * 24));
      let status;
      
      if (disputeAge > 30) {
        status = Math.random() < 0.8 ? (Math.random() < 0.7 ? 'Resolved - Accepted' : 'Resolved - Rejected') : 'Under Investigation';
      } else if (disputeAge > 15) {
        status = Math.random() < 0.5 ? 'Under Investigation' : (Math.random() < 0.5 ? 'Awaiting Customer' : 'Awaiting Internal Response');
      } else {
        status = Math.random() < 0.7 ? 'Open' : 'Under Investigation';
      }
      
      // Resolution date if resolved
      let resolutionDate = '';
      if (status.startsWith('Resolved')) {
        const resolutionDaysAfterOpen = Math.min(5 + Math.floor(Math.random() * 30), disputeAge - 1);
        const tempResDate = new Date(openDate);
        tempResDate.setDate(tempResDate.getDate() + resolutionDaysAfterOpen);
        resolutionDate = tempResDate.toISOString().split('T')[0];
      }
      
      // Assign handler
      const handler = salesReps[Math.floor(Math.random() * salesReps.length)];
      
      disputes.push({
        dispute_id: generateID('DISP', index + 1, 6),
        invoice_id: invoice.invoice_id,
        customer_id: invoice.customer_id,
        customer_name: invoice.customer_name,
        open_date: openDate.toISOString().split('T')[0],
        dispute_amount: disputeAmount,
        dispute_type: disputeType,
        status: status,
        assigned_to: handler.rep_name,
        handler_id: handler.rep_id,
        resolution_date: resolutionDate,
        resolution_notes: status.startsWith('Resolved') ? 
          (status === 'Resolved - Accepted' ? `Credit memo issued for ${disputeAmount}` : 'Dispute evidence insufficient') : '',
        description: `Customer disputes ${disputeType.toLowerCase()} on invoice ${invoice.invoice_id}`
      });
    });
  
    // Create the disputes CSV content
    let disputesCSV = 'dispute_id,invoice_id,customer_id,customer_name,open_date,dispute_amount,dispute_type,status,assigned_to,handler_id,resolution_date,resolution_notes,description\n';
    disputes.forEach(dispute => {
      disputesCSV += Object.values(dispute).join(',') + '\n';
    });
  
    return { disputes, disputesCSV };
  }
  
  // 9. Generate Payment Plan Data
  function generatePaymentPlanData(invoices, salesReps) {
    const paymentPlans = [];
    const planStatuses = ['Active', 'Completed', 'Defaulted', 'Canceled'];
  
    // Generate payment plans for some overdue invoices (about 30%)
    const paymentPlanInvoices = invoices.filter(inv => inv.payment_status === 'Overdue' && Math.random() < 0.3);
  
    paymentPlanInvoices.forEach((invoice, index) => {
      const dueDate = new Date(invoice.due_date);
      const currentDate = new Date('2025-04-18');
      
      // Calculate days overdue
      const daysOverdue = Math.round((currentDate - dueDate) / (1000 * 60 * 60 * 24));
      
      // Skip if not significantly overdue
      if (daysOverdue < 10) return;
      
      // Calculate a realistic plan start date
      const startDaysAfterDue = Math.min(5 + Math.floor(Math.random() * 15), daysOverdue - 1);
      const startDate = new Date(dueDate);
      startDate.setDate(startDate.getDate() + startDaysAfterDue);
      
      // Determine number of installments based on amount
      const balanceAmount = parseFloat(invoice.balance_amount);
      let installments;
      
      if (balanceAmount > 1000000) {
        installments = 4 + Math.floor(Math.random() * 4); // 4-7 installments
      } else if (balanceAmount > 500000) {
        installments = 3 + Math.floor(Math.random() * 3); // 3-5 installments
      } else {
        installments = 2 + Math.floor(Math.random() * 2); // 2-3 installments
      }
      
      // Calculate end date
      const monthsToAdd = installments;
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + monthsToAdd);
      
      // Determine plan status
      let status;
      const planAge = Math.round((currentDate - startDate) / (1000 * 60 * 60 * 24));
      const planDuration = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
      
      if (planAge > planDuration) {
        status = Math.random() < 0.8 ? 'Completed' : 'Defaulted';
      } else {
        status = Math.random() < 0.9 ? 'Active' : 'Canceled';
      }
      
      // Calculate installment amount
      const installmentAmount = (balanceAmount / installments).toFixed(2);
      
      // Determine installments paid
      let installmentsPaid = 0;
      if (status === 'Completed') {
        installmentsPaid = installments;
      } else if (status === 'Active') {
        const expectedCompletedInstallments = Math.floor(planAge / (planDuration / installments));
        installmentsPaid = Math.min(expectedCompletedInstallments, installments - 1);
      } else if (status === 'Defaulted') {
        installmentsPaid = Math.floor(installments * Math.random() * 0.3);
      } else if (status === 'Canceled') {
        installmentsPaid = Math.floor(installments * Math.random() * 0.3);
      }
      
      // Calculate remaining balance
      const remainingBalance = (balanceAmount - (installmentAmount * installmentsPaid)).toFixed(2);
      
      // Next installment date
      let nextInstallmentDate = '';
      if (status === 'Active') {
        const nextInstallmentDaysFromStart = Math.ceil((planAge / planDuration) * installments) * (planDuration / installments);
        const nextDate = new Date(startDate);
        nextDate.setDate(nextDate.getDate() + nextInstallmentDaysFromStart);
        nextInstallmentDate = nextDate.toISOString().split('T')[0];
      }
      
      // Assign handler
      const handler = salesReps[Math.floor(Math.random() * salesReps.length)];
      
      paymentPlans.push({
        plan_id: generateID('PLAN', index + 1, 6),
        invoice_id: invoice.invoice_id,
        customer_id: invoice.customer_id,
        customer_name: invoice.customer_name,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        original_amount: invoice.balance_amount,
        installments: installments,
        installment_amount: installmentAmount,
        installments_paid: installmentsPaid,
        remaining_balance: remainingBalance,
        status: status,
        created_by: handler.rep_name,
        handler_id: handler.rep_id,
        next_installment_date: nextInstallmentDate,
        last_payment_date: installmentsPaid > 0 ? generateRandomDate(startDate.toISOString().split('T')[0], currentDate.toISOString().split('T')[0]) : ''
      });
    });
  
    // Create the payment plans CSV content
    let paymentPlansCSV = 'plan_id,invoice_id,customer_id,customer_name,start_date,end_date,original_amount,installments,installment_amount,installments_paid,remaining_balance,status,created_by,handler_id,next_installment_date,last_payment_date\n';
    paymentPlans.forEach(plan => {
      paymentPlansCSV += Object.values(plan).join(',') + '\n';
    });
  
    return { paymentPlans, paymentPlansCSV };
  }
  
  // 10. Generate Analytics Data
  
  // 10.1 Customer Risk Scoring
  function generateRiskScoreData(customers, invoices, disputes, collectionCases) {
    const riskScores = [];
  
    customers.forEach(customer => {
      // Calculate various risk factors
      const customerInvoices = invoices.filter(inv => inv.customer_id === customer.customer_id);
      const totalInvoices = customerInvoices.length;
      if (totalInvoices === 0) return; // Skip if no invoices
      
      const overdueInvoices = customerInvoices.filter(inv => inv.payment_status === 'Overdue');
      const overdueRate = overdueInvoices.length / totalInvoices;
      
      const totalOutstanding = customerInvoices.reduce((sum, inv) => sum + parseFloat(inv.balance_amount), 0);
      const creditLimit = parseFloat(customer.credit_limit);
      const creditUtilization = totalOutstanding / creditLimit;
      
      const paidInvoices = customerInvoices.filter(inv => inv.payment_status === 'Paid');
      let avgDaysLate = 0;
      
      if (paidInvoices.length > 0) {
        let totalDaysLate = 0;
        paidInvoices.forEach(inv => {
          const dueDate = new Date(inv.due_date);
          const paymentDate = inv.payment_date ? new Date(inv.payment_date) : null;
          
          if (paymentDate) {
            const daysLate = Math.max(0, Math.round((paymentDate - dueDate) / (1000 * 60 * 60 * 24)));
            totalDaysLate += daysLate;
          }
        });
        avgDaysLate = totalDaysLate / paidInvoices.length;
      }
      
      const hasDisputes = disputes.some(d => d.customer_id === customer.customer_id);
      const hasPastCollectionCases = collectionCases.some(c => c.customer_id === customer.customer_id && c.status === 'Resolved');
      
      // Calculate risk score (0-100, higher = riskier)
      let riskScore = 20; // Base score
      
      // Add risk based on overdue rate (0-25 points)
      riskScore += overdueRate * 25;
      
      // Add risk based on credit utilization (0-20 points)
      riskScore += Math.min(creditUtilization * 20, 20);
      
      // Add risk based on avg days late (0-15 points)
      riskScore += Math.min(avgDaysLate * 0.5, 15);
      
      // Add risk based on disputes and collection history (0-20 points)
      if (hasDisputes) riskScore += 10;
      if (hasPastCollectionCases) riskScore += 10;
      
      // Cap at 100
      riskScore = Math.min(Math.round(riskScore), 100);
      
      // Determine risk category
      let riskCategory;
      if (riskScore >= 75) {
        riskCategory = 'High Risk';
      } else if (riskScore >= 50) {
        riskCategory = 'Medium Risk';
      } else if (riskScore >= 25) {
        riskCategory = 'Low Risk';
      } else {
        riskCategory = 'Minimal Risk';
      }
      
      // Recommended actions based on risk
      let recommendedAction;
      if (riskScore >= 75) {
        recommendedAction = 'Credit Hold / Advance Payment';
      } else if (riskScore >= 50) {
        recommendedAction = 'Reduce Credit Limit / Weekly Monitoring';
      } else if (riskScore >= 25) {
        recommendedAction = 'Monthly Review / Standard Terms';
      } else {
        recommendedAction = 'Standard Terms / Potential Credit Increase';
      }
      
      riskScores.push({
        customer_id: customer.customer_id,
        customer_name: customer.customer_name,
        risk_score: riskScore,
        risk_category: riskCategory,
        credit_limit: customer.credit_limit,
        outstanding_amount: totalOutstanding.toFixed(2),
        credit_utilization: (creditUtilization * 100).toFixed(2) + '%',
        overdue_rate: (overdueRate * 100).toFixed(2) + '%',
        avg_days_late: avgDaysLate.toFixed(1),
        total_invoices: totalInvoices,
        overdue_invoices: overdueInvoices.length,
        has_disputes: hasDisputes ? 'Yes' : 'No',
        has_collection_history: hasPastCollectionCases ? 'Yes' : 'No',
        recommended_action: recommendedAction,
        last_assessment_date: '2025-04-15'
      });
    });
  
    // Create the risk scores CSV content
    let riskScoresCSV = 'customer_id,customer_name,risk_score,risk_category,credit_limit,outstanding_amount,credit_utilization,overdue_rate,avg_days_late,total_invoices,overdue_invoices,has_disputes,has_collection_history,recommended_action,last_assessment_date\n';
    riskScores.forEach(score => {
      riskScoresCSV += Object.values(score).join(',') + '\n';
    });
  
    return { riskScores, riskScoresCSV };
  }

// 10.2 DSO Analytics
function generateDSOAnalytics(invoices) {
    const dsoAnalytics = [];
    const months = [
      '2024-10', '2024-11', '2024-12', 
      '2025-01', '2025-02', '2025-03', '2025-04'
    ];
  
    months.forEach(month => {
      const monthStart = new Date(month + '-01');
      let monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(monthEnd.getDate() - 1);
      
      const monthStartStr = monthStart.toISOString().split('T')[0];
      const monthEndStr = monthEnd.toISOString().split('T')[0];
      
      // Get invoices created in this month
      const monthInvoices = invoices.filter(inv => {
        const invDate = inv.invoice_date;
        return invDate >= monthStartStr && invDate <= monthEndStr;
      });
      
      // Calculate total revenue for the month
      const totalRevenue = monthInvoices.reduce((sum, inv) => sum + parseFloat(inv.invoice_amount), 0);
      
      // Get all open receivables at end of month
      const openReceivables = invoices.filter(inv => {
        const invDate = inv.invoice_date;
        const isPaid = inv.payment_status === 'Paid';
        const paymentDate = inv.payment_date;
        
        // Invoice created before or during this month
        const createdBeforeMonthEnd = invDate <= monthEndStr;
        
        // Either unpaid or paid after month end
        const stillOpenAtMonthEnd = !isPaid || (paymentDate && paymentDate > monthEndStr);
        
        return createdBeforeMonthEnd && stillOpenAtMonthEnd;
      });
      
      // Calculate total AR at end of month
      const totalAR = openReceivables.reduce((sum, inv) => sum + parseFloat(inv.balance_amount), 0);
      
      // Calculate average daily sales
      const daysInMonth = monthEnd.getDate();
      const avgDailySales = totalRevenue / daysInMonth;
      
      // Calculate DSO
      const dso = avgDailySales > 0 ? Math.round(totalAR / avgDailySales) : 0;
      
      // Calculate aging buckets
      const aging = {
        'current': 0,
        '1_30': 0,
        '31_60': 0,
        '61_90': 0,
        'over_90': 0
      };
      
      openReceivables.forEach(inv => {
        const invDueDate = new Date(inv.due_date);
        const daysOverdue = Math.round((monthEnd - invDueDate) / (1000 * 60 * 60 * 24));
        const balance = parseFloat(inv.balance_amount);
        
        if (daysOverdue <= 0) {
          aging.current += balance;
        } else if (daysOverdue <= 30) {
          aging['1_30'] += balance;
        } else if (daysOverdue <= 60) {
          aging['31_60'] += balance;
        } else if (daysOverdue <= 90) {
          aging['61_90'] += balance;
        } else {
          aging.over_90 += balance;
        }
      });
      
      // Calculate collection effectiveness index (CEI)
      const startAR = invoices.filter(inv => {
        const invDate = inv.invoice_date;
        const isPaid = inv.payment_status === 'Paid';
        const paymentDate = inv.payment_date;
        
        // Invoice created before this month
        const createdBeforeMonth = invDate < monthStartStr;
        
        // Either unpaid or paid after month start
        const stillOpenAtMonthStart = !isPaid || (paymentDate && paymentDate >= monthStartStr);
        
        return createdBeforeMonth && stillOpenAtMonthStart;
      }).reduce((sum, inv) => sum + parseFloat(inv.balance_amount), 0);
      
      const currentMonthCredit = monthInvoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0);
      const endingAR = totalAR;
      
      // CEI formula: (Beginning AR + Monthly Credit - Ending AR) / (Beginning AR + Monthly Credit) * 100
      const cei = (startAR + currentMonthCredit) > 0 ? 
        ((startAR + currentMonthCredit - endingAR) / (startAR + currentMonthCredit) * 100).toFixed(2) : 0;
      
      dsoAnalytics.push({
        month: month,
        total_revenue: totalRevenue.toFixed(2),
        total_ar: totalAR.toFixed(2),
        dso: dso,
        current_ar: aging.current.toFixed(2),
        ar_1_30_days: aging['1_30'].toFixed(2),
        ar_31_60_days: aging['31_60'].toFixed(2),
        ar_61_90_days: aging['61_90'].toFixed(2),
        ar_over_90_days: aging.over_90.toFixed(2),
        cei_percentage: cei,
        invoices_count: monthInvoices.length,
        paid_invoices: monthInvoices.filter(inv => inv.payment_status === 'Paid').length,
        disputed_invoices: 0 // This will be updated later
      });
    });
  
    // Create the DSO analytics CSV content
    let dsoAnalyticsCSV = 'month,total_revenue,total_ar,dso,current_ar,ar_1_30_days,ar_31_60_days,ar_61_90_days,ar_over_90_days,cei_percentage,invoices_count,paid_invoices,disputed_invoices\n';
    dsoAnalytics.forEach(record => {
      dsoAnalyticsCSV += Object.values(record).join(',') + '\n';
    });
  
    return { dsoAnalytics, dsoAnalyticsCSV };
  }
  
  // 10.3 Collection Performance Analytics
  function generateCollectionPerformanceData(collectionCases) {
    const collectionPerformance = [];
  
    // Group collection cases by collector
    const collectorGroups = {};
    
    // Process collection cases
    collectionCases.forEach(ccase => {
      const collectorId = ccase.collector_id;
      
      if (!collectorGroups[collectorId]) {
        collectorGroups[collectorId] = {
          collector_id: collectorId,
          collector_name: ccase.assigned_to,
          total_cases: 0,
          resolved_cases: 0,
          escalated_cases: 0,
          amt_assigned: 0,
          amt_collected: 0,
          avg_resolution_days: 0,
          cei_percentage: 0
        };
      }
      
      const group = collectorGroups[collectorId];
      group.total_cases++;
      group.amt_assigned += parseFloat(ccase.amount_due);
      
      if (ccase.status === 'Resolved') {
        group.resolved_cases++;
        group.amt_collected += parseFloat(ccase.amount_due);
        
        // Calculate resolution days
        const openDate = new Date(ccase.case_open_date);
        const resolveDate = new Date(ccase.resolution_date);
        const resolutionDays = Math.round((resolveDate - openDate) / (1000 * 60 * 60 * 24));
        
        // Update average
        group.avg_resolution_days = 
          (group.avg_resolution_days * (group.resolved_cases - 1) + resolutionDays) / group.resolved_cases;
      }
      
      if (ccase.status === 'Escalated') {
        group.escalated_cases++;
      }
    });
  
    // Calculate CEI for each collector
    Object.values(collectorGroups).forEach(group => {
      if (group.amt_assigned > 0) {
        group.cei_percentage = (group.amt_collected / group.amt_assigned * 100).toFixed(2);
      }
      
      // Only include collectors with at least one case
      if (group.total_cases > 0) {
        collectionPerformance.push({
          collector_id: group.collector_id,
          collector_name: group.collector_name,
          total_cases: group.total_cases,
          resolved_cases: group.resolved_cases,
          escalated_cases: group.escalated_cases,
          resolution_rate: ((group.resolved_cases / group.total_cases) * 100).toFixed(2) + '%',
          escalation_rate: ((group.escalated_cases / group.total_cases) * 100).toFixed(2) + '%',
          amount_assigned: group.amt_assigned.toFixed(2),
          amount_collected: group.amt_collected.toFixed(2),
          avg_resolution_days: group.avg_resolution_days.toFixed(1),
          cei_percentage: group.cei_percentage + '%',
          assessment_date: '2025-04-17'
        });
      }
    });
  
    // Create the collection performance CSV content
    let collectionPerformanceCSV = 'collector_id,collector_name,total_cases,resolved_cases,escalated_cases,resolution_rate,escalation_rate,amount_assigned,amount_collected,avg_resolution_days,cei_percentage,assessment_date\n';
    collectionPerformance.forEach(record => {
      collectionPerformanceCSV += Object.values(record).join(',') + '\n';
    });
  
    return { collectionPerformance, collectionPerformanceCSV };
  }
  
  // 10.4 Collection Strategy Effectiveness
  function generateStrategyEffectivenessData(collectionCases) {
    const strategyEffectiveness = [];
  
    // Group by collection strategy
    const strategies = [
      'Standard Follow-up', 
      'Intensive Collection', 
      'Legal Action Warning', 
      'Payment Plan', 
      'Settlement Offer'
    ];
  
    strategies.forEach(strategy => {
      const strategyCases = collectionCases.filter(c => c.collection_strategy === strategy);
      const totalCases = strategyCases.length;
      if (totalCases === 0) return;
      
      const resolvedCases = strategyCases.filter(c => c.status === 'Resolved').length;
      const totalAssigned = strategyCases.reduce((sum, c) => sum + parseFloat(c.amount_due), 0);
      const totalCollected = strategyCases
        .filter(c => c.status === 'Resolved')
        .reduce((sum, c) => sum + parseFloat(c.amount_due), 0);
      
      // Calculate average resolution days
      let totalResolutionDays = 0;
      let casesWithResolution = 0;
      
      strategyCases.forEach(c => {
        if (c.status === 'Resolved' && c.case_open_date && c.resolution_date) {
          const openDate = new Date(c.case_open_date);
          const resolveDate = new Date(c.resolution_date);
          const days = Math.round((resolveDate - openDate) / (1000 * 60 * 60 * 24));
          totalResolutionDays += days;
          casesWithResolution++;
        }
      });
      
      const avgResolutionDays = casesWithResolution > 0 ? (totalResolutionDays / casesWithResolution).toFixed(1) : '0';
      
      // Calculate success rate
      const successRate = totalCases > 0 ? ((resolvedCases / totalCases) * 100).toFixed(2) + '%' : '0%';
      
      // Calculate recovery rate
      const recoveryRate = totalAssigned > 0 ? ((totalCollected / totalAssigned) * 100).toFixed(2) + '%' : '0%';
      
      // Calculate average case amount
      const avgCaseAmount = totalCases > 0 ? (totalAssigned / totalCases).toFixed(2) : '0';
      
      // Determine best for amount range
      let bestForRange;
      const averageAmounts = {
        'Standard Follow-up': strategyCases.filter(c => c.priority === 'Low').length / totalCases > 0.5 ? 'Low' : 'Medium',
        'Intensive Collection': strategyCases.filter(c => c.priority === 'Medium').length / totalCases > 0.5 ? 'Medium' : 'High',
        'Legal Action Warning': strategyCases.filter(c => c.priority === 'High' || c.priority === 'Critical').length / totalCases > 0.7 ? 'High' : 'Critical',
        'Payment Plan': 'Medium-High',
        'Settlement Offer': 'High'
      };
      
      bestForRange = averageAmounts[strategy] || 'Medium';
      
      strategyEffectiveness.push({
        strategy_name: strategy,
        total_cases: totalCases,
        resolved_cases: resolvedCases,
        success_rate: successRate,
        total_amount_assigned: totalAssigned.toFixed(2),
        total_amount_collected: totalCollected.toFixed(2),
        recovery_rate: recoveryRate,
        avg_resolution_days: avgResolutionDays,
        avg_case_amount: avgCaseAmount,
        best_for_amount_range: bestForRange,
        assessment_date: '2025-04-17'
      });
    });
  
    // Create the strategy effectiveness CSV content
    let strategyEffectivenessCSV = 'strategy_name,total_cases,resolved_cases,success_rate,total_amount_assigned,total_amount_collected,recovery_rate,avg_resolution_days,avg_case_amount,best_for_amount_range,assessment_date\n';
    strategyEffectiveness.forEach(record => {
      strategyEffectivenessCSV += Object.values(record).join(',') + '\n';
    });
  
    return { strategyEffectiveness, strategyEffectivenessCSV };
  }
  
  // Main function to generate all data sets
  function generateAllDatasets() {
    console.log("Starting data generation...");
    
    // Generate customer data first
    const customerData = generateCustomerData();
    console.log(`Generated ${customerData.customers.length} customer records`);
    
    // Generate invoice data
    const invoiceData = generateInvoiceData(customerData.customers);
    console.log(`Generated ${invoiceData.invoices.length} invoice records and ${invoiceData.invoiceLineItems.length} line items`);
    
    // Generate payment data
    const paymentData = generatePaymentData(invoiceData.invoices);
    console.log(`Generated ${paymentData.payments.length} payment records`);
    
    // Generate GL entry data
    const glEntryData = generateGLEntryData(invoiceData.invoices);
    console.log(`Generated ${glEntryData.glEntries.length} GL entry records`);
    
    // Generate order data
    const orderData = generateOrderData(invoiceData.invoices, customerData.customers);
    console.log(`Generated ${orderData.orders.length} order records`);
    
    // Generate interaction data
    const interactionData = generateInteractionData(customerData.customers, invoiceData.invoices, invoiceData.salesReps);
    console.log(`Generated ${interactionData.interactions.length} interaction records`);
    
    // Generate collection case data
    const collectionCaseData = generateCollectionCaseData(invoiceData.invoices, invoiceData.salesReps);
    console.log(`Generated ${collectionCaseData.collectionCases.length} collection case records`);
    
    // Generate dispute data
    const disputeData = generateDisputeData(invoiceData.invoices, invoiceData.salesReps);
    console.log(`Generated ${disputeData.disputes.length} dispute records`);
    
    // Generate payment plan data
    const paymentPlanData = generatePaymentPlanData(invoiceData.invoices, invoiceData.salesReps);
    console.log(`Generated ${paymentPlanData.paymentPlans.length} payment plan records`);
    
    // Generate risk score data
    const riskScoreData = generateRiskScoreData(customerData.customers, invoiceData.invoices, disputeData.disputes, collectionCaseData.collectionCases);
    console.log(`Generated ${riskScoreData.riskScores.length} risk score records`);
    
    // Generate DSO analytics data
    const dsoAnalyticsData = generateDSOAnalytics(invoiceData.invoices);
    console.log(`Generated ${dsoAnalyticsData.dsoAnalytics.length} DSO analytics records`);
    
    // Generate collection performance data
    const collectionPerformanceData = generateCollectionPerformanceData(collectionCaseData.collectionCases);
    console.log(`Generated ${collectionPerformanceData.collectionPerformance.length} collection performance records`);
    
    // Generate strategy effectiveness data
    const strategyEffectivenessData = generateStrategyEffectivenessData(collectionCaseData.collectionCases);
    console.log(`Generated ${strategyEffectivenessData.strategyEffectiveness.length} strategy effectiveness records`);
    
    // Return all CSV content
    return {
      "customer_master.csv": customerData.customerCSV,
      "invoices.csv": invoiceData.invoiceCSV,
      "invoice_line_items.csv": invoiceData.invoiceLineItemsCSV,
      "payments.csv": paymentData.paymentCSV,
      "gl_entries.csv": glEntryData.glEntriesCSV,
      "orders.csv": orderData.ordersCSV,
      "customer_interactions.csv": interactionData.interactionsCSV,
      "collection_cases.csv": collectionCaseData.collectionCasesCSV,
      "disputes.csv": disputeData.disputesCSV,
      "payment_plans.csv": paymentPlanData.paymentPlansCSV,
      "risk_scores.csv": riskScoreData.riskScoresCSV,
      "dso_analytics.csv": dsoAnalyticsData.dsoAnalyticsCSV,
      "collection_performance.csv": collectionPerformanceData.collectionPerformanceCSV,
      "strategy_effectiveness.csv": strategyEffectivenessData.strategyEffectivenessCSV
    };
  }
  
  // Create a directory for the output files
  const outputDir = path.join(__dirname, 'generated_data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  // Execute the data generation
  const datasetFiles = generateAllDatasets();
  
  // Save files to disk
  console.log("\nSaving Generated Files:");
  for (const [filename, content] of Object.entries(datasetFiles)) {
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, content, 'utf8');
    const lineCount = content.split('\n').length - 1;
    console.log(`${filename}: ${lineCount} rows - Saved to ${filepath}`);
  }

  console.log(`\nAll files have been saved to: ${outputDir}`);