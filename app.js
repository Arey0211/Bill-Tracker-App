const express       = require ('express'),
      bodyParser    = require ('body-parser'),
      mongoose      = require ('mongoose'),
      override      = require ('method-override'),
      Bills         = require ('./DBModels/bills'),
      Debt          = require ('./DBModels/debt'),
      Note          = require ('./DBModels/debtNotes'),
      Income        = require ('./DBModels/income'),

      app           = express();


mongoose.connect ('mongodb://localhost/bill_tracker');

app.set ('view engine', 'ejs');
app.use (express.static(__dirname + '/public'));
app.use (bodyParser.urlencoded({extended: true}));
app.use (override('_method'));


//INDEX============================================================================================================
app.get ('/', (req, res) => {
  Bills.find ({}, (err, foundBills) => {
    if (err){
      console.log (err);
      res.redirect ('/');
    } else {
      Debt.find ({}, (err, debts) => {
        if (err){
          console.log (err);
          res.redirect ('/');
        } else {
          Income.find ({}, (err, foundIncome) => {
            if (err){
              console.log (err);
              res.redirect ('/');
            } else {
              res.render ('pages/index', {bills: foundBills, debts: debts, income: foundIncome});
            }
          });
        }
      });
    }
  }).sort({dueDay: 1});
});
//END INDEX=======================================================================================================

// ROUTES FOR BILLS============================================================================================
//BILLS
app.get ('/bills', (req, res) => {
  Bills.find({}, (err, bills) => {
    if(err){
      console.log(err);
      res.redirect('/');
    } else {
      res.render ('pages/bills/bills', {bills: bills});
    }
  }).sort({dueDay: 1});
});

//CREATE BILL
app.post ('/bills', (req, res) => {
  Bills.create (req.body.bill, (err, createdBill) => {
    if(err){
      console.log(err);
      res.redirect ('/');
    } else {
      res.redirect ('/bills');
    }
  });
});

//NEW BILL FORM
app.get ('/bills/new', (req, res) => {
  res.render ('pages/bills/newBill');
});


// EDIT BILLS FORM
app.get ('/bills/:id/edit', (req, res) => {
  Bills.findById (req.params.id, (err, foundId) => {
    if(err){
      console.log(err);
      res.redirect ('/');
    } else {
      res.render ('pages/bills/editBill', {bill: foundId});
    }
  });
});

// EDIT BILLS
app.put ('/bills/:id', (req, res) => {
  Bills.findByIdAndUpdate (req.params.id, req.body.bill, (err, foundId) => {
    if(err){
      console.log(err);
      res.redirect ('/');
    } else {
      res.redirect ('/bills');
    }
  });
});

// DELETE BILL
app.delete ('/bills/:id',  (req, res) => {
  Bills.findByIdAndDelete (req.params.id, req.body.bills, (err, deletedBill) => {
    if (err){
      console.log (err);
      res.send('You Done messed up A-A-Ron!!!!');
    } else {
      res.redirect ('/bills');
    }
  });
});

// CURRENTLY DUE BILLS
app.get ('/currentDueBills', (req, res) => {
  Bills.find ({}, (err, foundBills) => {
    if (err) {
      console.log(err);
      res.redirect ('/currentDueBills');
    } else {
      res.render ('pages/bills/currentDueBills', {bills: foundBills});
    }
  }).sort({dueDay: 1});
});

// END ROUTES FOR BILLS==============================================================================================

// ROUTES FOR DEBT===================================================================================================
//DEBT
app.get ('/debts', (req, res) => {
  Debt.find({}, (err, foundDebt) => {
    if(err){
      console.log(err);
      res.redirect('/');
    } else {
      res.render ('pages/debts/debts', {debts: foundDebt});
    }
  });
});

//CREATE DEBT
app.post ('/debts', (req, res) => {
  Debt.create (req.body.debt, (err, createdDebt) => {
    if(err){
      console.log(err);
      res.redirect ('/debts');
    } else {
      res.redirect ('/debts');
    }
  });
});

//NEW DEBT FORM
app.get ('/debts/new', (req, res) => {
  res.render ('pages/debts/newDebts');
});

// DEBTS SHOW PAGE
app.get ('/debts/:id', (req, res) => {
  Debt.findById (req.params.id).populate ('notes').exec ((err, foundId) => {
    if (err){
      console.log(err);
      res.redirect ('/debts');
    } else {
      res.render ('pages/debts/showDebt', {debt: foundId});
    }
  });
});


// EDIT DEBT FORM
app.get ('/debts/:id/edit', (req, res) => {
  Debt.findById (req.params.id, (err, foundId) => {
    if(err){
      console.log(err);
      res.redirect ('/debts');
    } else {
      res.render ('pages/debts/editDebts', {debt: foundId});
    }
  });
});

// EDIT DEBT
app.put ('/debts/:id', (req, res) => {
  Debt.findByIdAndUpdate (req.params.id, req.body.debt, (err, foundId) => {
    if(err){
      console.log(err);
      res.redirect ('/debts');
    } else {
      res.redirect ('/debts');
    }
  });
});

// DELETE DEBT
app.delete ('/debts/:id',  (req, res) => {
  Debt.findByIdAndDelete (req.params.id, req.body.debts, (err, deletedDebt) => {
    if (err){
      console.log (err);
      res.redirect ('/debts');
    } else {
      res.redirect ('/debts');
    }
  });
});
//END ROUTES FOR DEBT================================================================================================

// DEBT NOTES ROUTES=================================================================================================

// NEW NOTE FORM
app.get ('/debts/:id/notes/new', (req, res) => {
	Debt.findById (req.params.id, (err, foundId) => {
		if (err){
      console.log (err);
      res.redirect ('/debts/:id');
		} else {
			res.render ('pages/notes/newNote', {debt: foundId});
		}
	});
});

// CREATE
app.post ('/debts/:id/notes', (req,res) => {
	Debt.findById (req.params.id, (err, foundDebt) => {
		if (err){
			console.log(err);
      res.redirect ('/debts/:id' + req.params.id);
		} else {
			const newComment = req.body.note;
			Note.create (newComment, (err, newNote) => {
				if (err){
					console.log(err);
					res.redirect ('/debts/' + req.params.id);
				} else {
					foundDebt.notes.push(newNote);
					foundDebt.save();
					res.redirect ('/debts/' + foundDebt._id);
				}
			});
		}
	});
});

// EDIT FORM
app.get ('/debts/:id/notes/:id/edit', (req, res) => {
  Debt.findById (req.params.id, (err, foundDebt) => {
    const debt = foundDebt;
    if(err){
      console.log(err);
      res.redirect ('/debts');
    } else {
      Note.findById (req.params.id, (err, foundNote) => {
        const note = foundNote;
        if (err){
          console.log(err);
          res.redirect ('/debts/')
        } else {
          res.render ('pages/notes/editNote', {debt: foundDebt, note: foundNote});
        }
      });
    }
  });
});

// EDIT
app.put ('/debts/:id/notes/:id', (req, res) => {
  Debt.findByIdAndUpdate (req.params.id, req.body.debt, (err, foundId) => {
    if(err){
      console.log(err);
      res.redirect ('/debts');
    } else {
      Note.findByIdAndUpdate (req.params.id, req.body.note, (err, foundNote) => {
        if(err){
          console.log(err);
          res.redirect('/debts/' + foundId._id)
        } else {
          res.redirect ('/debts/:id' + foundId._id)
        }
      });
    }
  });
});

// DELETE
app.delete ('/debts/:id/notes/:id',  (req, res) => {
  Debt.findByIdAndUpdate (req.params.id, req.body.debt, (err, foundDebt) => {
    if (err){
      console.log (err);
      res.redirect ('/debts');
    } else {
      Note.findByIdAndDelete (req.params.id, req.body.note, (err, foundNote) => {
        if (err){
          console.log(err);
          res.redirect ('/debts/')
        } else {
          res.redirect ('/debts/')
        }
      });
    }
  });
});
//END DEBT NOTE ROUTES=================================================================================================

// ROUTES FOR INCOME===================================================================================================
//INCOME
app.get ('/income', (req, res) => {
  Income.find({}, (err, foundIncome) => {
    if(err){
      console.log(err);
      res.redirect('/');
    } else {
      res.render ('pages/income/income', {income: foundIncome});
    }
  });
});

//CREATE INCOME
app.post ('/income', (req, res) => {
  Income.create (req.body.income, (err, createdIncome) => {
    if(err){
      console.log(err);
      res.redirect ('/income');
    } else {
      res.redirect ('/income');
    }
  });
});

//NEW INCOME FORM
app.get ('/income/new', (req, res) => {
  res.render ('pages/income/newIncome');
});


// EDIT INCOME FORM
app.get ('/income/:id/edit', (req, res) => {
  Income.findById (req.params.id, (err, foundId) => {
    if(err){
      console.log(err);
      res.redirect ('/income');
    } else {
      res.render ('pages/income/editIncome', {income: foundId});
    }
  });
});

// EDIT INCOME
app.put ('/income/:id', (req, res) => {
  Income.findByIdAndUpdate (req.params.id, req.body.income, (err, foundId) => {
    if(err){
      console.log(err);
      res.redirect ('/income');
    } else {
      res.redirect ('/income');
    }
  });
});

// DELETE INCOME
app.delete ('/income/:id',  (req, res) => {
  Income.findByIdAndDelete (req.params.id, req.body.income, (err, deletedIncome) => {
    if (err){
      console.log (err);
      res.redirect ('/income');
    } else {
      res.redirect ('/income');
    }
  });
});
//END ROUTES FOR INCOME================================================================================================



app.listen (3000, function (){
  console.log ('Bill-Tracker Started!!!')
});