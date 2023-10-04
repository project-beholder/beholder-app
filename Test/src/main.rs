pub mod operations;
use self::operations::*;

pub mod markers;
use self::markers::{MarkerMap, MarkerProperties};

use std::collections::HashMap;
use std::rc::Rc;
use std::cell::{RefCell, Ref};
use std::sync::mpsc::Receiver;

pub struct Test {
    // a: Rc<RefCell<Operand>>,
    // b: Rc<RefCell<Operand>>,
    // x: Rc<RefCell<Operand>>,
    // y: Rc<RefCell<Operand>>,
    // t: Vec<Rc<RefCell<Operand>>>,
            // fn_vec: Vec<Box<dyn Fn>
    // ops_num: HashMap<String, Rc<RefCell<i32>>>,
    // ops_bool: HashMap<String, Rc<RefCell<bool>>>

    // pub map: MarkerMap
}

// impl Test {
    // pub fn update_struct(&mut self, a: i32, b: i32, x: bool, y: bool) {
    //     self.ops_num.insert(String::from("A"), Rc::new(RefCell::new(a)));
    //     self.ops_num.insert(String::from("B"), Rc::new(RefCell::new(b)));

    //     self.ops_bool.insert(String::from("X"), Rc::new(RefCell::new(x)));
    //     self.ops_bool.insert(String::from("Y"), Rc::new(RefCell::new(y)));   
    // }

    // fn eval_bool_op(&self, o: &str) -> Rc<RefCell<Rc<dyn Evaluate>>> {
    //     println!("Parsing: {o}");
    //     // match o {
    //     //     "X" => Rc::clone(&self.x),
    //     //     "Y" => Rc::clone(&self.y),
    //     //     _   => match o.find("$") {
    //     //             Some(_) => Rc::clone(&Rc::new(RefCell::new(Operand::Function(self.add_expression(o))))),
    //     //             None => Rc::clone(&Rc::new(RefCell::new(Operand::Boolean(false))))
    //     //         },
    //     // }

    //     // match o.find("$") {
    //     //     Some(_) => Rc::clone(&Rc::new(RefCell::new(self.add_expression(o)))),
    //     //     None => Rc::clone(&self.ops.get(o).unwrap())
    //     // }

    //     match o.find("$") {
    //         Some(_) => Rc::clone(&Rc::new(RefCell::new(Rc::clone(&self.add_expression(o))))),
    //         None => Rc::clone(&Rc::new(RefCell::new(Rc::new(Value ))))
    //     }
    // }

    // fn eval_num_op(&self, o: &str) -> Rc<RefCell<i32>> {
    //     println!("Parsing: {o}");
    //     match o {
    //         "A" => Rc::clone(&self.a),
    //         "B" => Rc::clone(&self.b),
    //         _   => match o.parse::<i32>() {
    //                 Ok(v) => Rc::clone(&Rc::new(RefCell::new(v))),
    //                 Err(_) =>  Rc::clone(&Rc::new(RefCell::new(0))),
    //             }
    //     }
    // }

    // pub fn add_expression(&self, e: &str) -> Rc<RefCell<dyn Evaluate>> {
    //     let cmd = &e[0..e.find('(').unwrap()];
    //     println!("Evaluating command: {}", cmd);
    //     match cmd {
    //         "$VAL" => {
    //             // let r = self.eval_bool_op(&e[e.find('(').unwrap()+1..e.len()-1]);
    //             // // Box::new(move || *r)
    //             // Rc::new(Value{
    //             //     pointer: r
    //             // })

    //             let op = &e[e.find('(').unwrap()+1..e.len()-1];
    //             Rc::new(RefCell::new(Value {
    //                 pointer: Rc::clone(&self.ops_bool.get(op).unwrap())
    //             }))
    //         },
            // "$GT" => {
            //     let l = self.eval_num_op(&e[e.find('(').unwrap()+1..e.find(',').unwrap()]);
            //     let r = self.eval_num_op(&e[e.find(',').unwrap()+1..e.len()-1]);
            //     // Box::new(move || {
            //     //     println!("Operating: {} > {}", *l, *r);
            //     //     *l > *r }
            //     // )
            //     Box::new(GreaterThan{
            //         pointer_l: l,
            //         pointer_r: r
            //     })
            // },
            // "$LT" => {
            //     let l = self.eval_num_op(&e[e.find('(').unwrap()+1..e.find(',').unwrap()]);
            //     let r = self.eval_num_op(&e[e.find(',').unwrap()+1..e.len()-1]);

            //     // Box::new(move || *l < *r)
            //     Box::new(LessThan{
            //         pointer_l: l,
            //         pointer_r: r
            //     })
            // },
            // "$BT" => {
            //     let l = self.eval_num_op(&e[e.find('(').unwrap()+1..e.find(',').unwrap()]);
            //     let m = self.eval_num_op(&e[e.find(',').unwrap()+1..e.find(';').unwrap()]);
            //     let r = self.eval_num_op(&e[e.find(';').unwrap()+1..e.len()-1]);

            //     // Box::new(move || (*l < *m) && (*m < *r))
            //     Box::new(Between{
            //         pointer_l: l,
            //         pointer_m: m,
            //         pointer_r: r
            //     })
            // },
            // "$NOT" => {
            //     // let r = self.eval_bool_op(&e[e.find('(').unwrap()+1..e.len()-1]);
            //     // // Box::new(move || !r)
            //     // Box::new(Not{
            //     //     pointer: r
            //     // })
            //     let op = &e[e.find('(').unwrap()+1..e.len()-1];

            //     match op.find("$") {
            //         // Some(_) => Rc::clone(&self.add_expression(op)),
            //         Some(_) => Rc::new(Not {
            //             pointer: Rc::clone(&Rc::new(RefCell::new(self.add_expression(op))))
            //         }),
            //         None => Rc::new(Not {
            //             pointer: Rc::new(RefCell::new(Rc::new(Value{
            //                 pointer: Rc::clone(&self.ops_bool.get(op).unwrap())
            //             })))
            //         })
            //     }
            // }
            // "$AND" => {
            //     let l = self.eval_bool_op(&e[e.find('(').unwrap()+1..e.find(',').unwrap()]);
            //     let r = self.eval_bool_op(&e[e.find(',').unwrap()+1..e.len()-1]);

            //     // Box::new(move || l && r)
            //     Box::new(And{
            //         pointer_l: l,
            //         pointer_r: r
            //     })
            // },
            // "$OR" => {
            //     let l = self.eval_bool_op(&e[e.find('(').unwrap()+1..e.find(',').unwrap()]);
            //     let r = self.eval_bool_op(&e[e.find(',').unwrap()+1..e.len()-1]);

            //     // Box::new(move || l || r)
            //     Box::new(Or{
            //         pointer_l: l,
            //         pointer_r: r
            //     })
            // },

    //         _ => Rc::new(RefCell::new(Default{})),
    //     }
    // }

    // pub fn print_struct(&self) {
    //     for (k, v) in &self.ops_bool {
    //         print!("{}: {} ", k, *v.borrow());
    //     }
    //     println!();
    //     for (k, v) in &self.ops_num {
    //         print!("{}: {} ", k, *v.borrow());
    //     }
    //     println!();
    // }
// }


fn parse_expression(e: &str, map: &Rc<RefCell<MarkerMap>>) -> Rc<RefCell<dyn Evaluate>> {
    println!("[DEBUG] Evaluating command: {}", e);
    let cmd = &e[0..e.find('(').unwrap()];

    match cmd {
        "$VAL" => {
            let id = (&e[e.find('(').unwrap()+1..e.find('#').unwrap()]).parse::<i32>().unwrap();
            let prop = &e[e.find('#').unwrap()+1..e.find(')').unwrap()];
            println!("[DEBUG] Found parameter: marker [{}], property [{}]", id, prop);
            match prop {
                "d" => Rc::new(RefCell::new(Value{
                    mm: Rc::clone(map),
                    id: id,
                    prop: MarkerProperties::D
                })),
                _ => Rc::new(RefCell::new(Default{}))
            }
        },
        "$NOT" => {
            let op = &e[e.find('(').unwrap()+1..e.len()-1];
            match op.find('$') {
                Some(_) => Rc::new(RefCell::new (Not {
                    pointer: Rc::clone(&parse_expression(op, map))
                })),
                None => {
                    let mut val_op = String::from("$VAL(");
                    val_op.push_str(op);
                    val_op.push_str(")");
                    println!("[DEBUG] Changing operand {} to {}", op, val_op);

                    Rc::new(RefCell::new(Not {
                        pointer: Rc::clone(&parse_expression(&val_op, map))
                    }))
                }
            }
        },
        "$AND" => {
            let l_op = &e[e.find('(').unwrap()+1..e.find(',').unwrap()];
            let r_op = &e[e.find(',').unwrap()+1..e.len()-1];

            println!("[DEBUG] Found l_op: {l_op}, r_op: {r_op}");

            let l_fn = match l_op.find('$') {
                Some(_) => Rc::clone(&parse_expression(l_op, map)),
                None => {
                    let mut val_op = String::from("$VAL(");
                    val_op.push_str(l_op);
                    val_op.push_str(")");
                    println!("[DEBUG] Changing operand {} to {}", l_op, val_op);

                    Rc::clone(&parse_expression(&val_op, map))
                }
            };

            let r_fn = match r_op.find('$') {
                Some(_) => Rc::clone(&parse_expression(r_op, map)),
                None => {
                    let mut val_op = String::from("$VAL(");
                    val_op.push_str(r_op);
                    val_op.push_str(")");
                    println!("[DEBUG] Changing operand {} to {}", r_op, val_op);

                    Rc::clone(&parse_expression(&val_op, map))
                }
            };

            Rc::new(RefCell::new(And {
                pointer_l: l_fn,
                pointer_r: r_fn
            }))
        },
        "$OR" => {
            let l_op = &e[e.find('(').unwrap()+1..e.find(',').unwrap()];
            let r_op = &e[e.find(',').unwrap()+1..e.len()-1];

            let l_fn = match l_op.find('$') {
                Some(_) => Rc::clone(&parse_expression(l_op, map)),
                None => {
                    let mut val_op = String::from("$VAL(");
                    val_op.push_str(l_op);
                    val_op.push_str(")");
                    println!("[DEBUG] Changing operand {} to {}", l_op, val_op);

                    Rc::clone(&parse_expression(&val_op, map))
                }
            };

            let r_fn = match r_op.find('$') {
                Some(_) => Rc::clone(&parse_expression(r_op, map)),
                None => {
                    let mut val_op = String::from("$VAL(");
                    val_op.push_str(r_op);
                    val_op.push_str(")");
                    println!("[DEBUG] Changing operand {} to {}", r_op, val_op);

                    Rc::clone(&parse_expression(&val_op, map))
                }
            };

            Rc::new(RefCell::new(Or {
                pointer_l: l_fn,
                pointer_r: r_fn
            }))
        },
        "$GT" => {
            let l_op = &e[e.find('(').unwrap()+1..e.find(',').unwrap()];
            let l_id = (&l_op[0..l_op.find('#').unwrap()]).parse::<i32>().unwrap();
            let l_prop = &l_op[l_op.find('#').unwrap()+1..l_op.len()];

            println!("[DEBUG] l_prop string: {l_prop}, l_id: {l_id}");

            let r_op = &e[e.find(',').unwrap()+1..e.len()-1];
            let r_id = (&r_op[0..r_op.find('#').unwrap()]).parse::<i32>().unwrap();
            let r_prop = &r_op[r_op.find('#').unwrap()+1..r_op.len()];

            println!("[DEBUG] r_prop string: {r_prop}, r_id: {r_id}");

            Rc::new(RefCell::new(GreaterThan {
                mm: Rc::clone(map),
                l_id,
                l_prop: String::from(l_prop),
                r_id,
                r_prop: String::from(r_prop)
            }))

        },
        "$LT" => {
            let l_op = &e[e.find('(').unwrap()+1..e.find(',').unwrap()];
            let l_id = (&l_op[0..l_op.find('#').unwrap()]).parse::<i32>().unwrap();
            let l_prop = &l_op[l_op.find('#').unwrap()+1..l_op.len()];

            println!("[DEBUG] l_prop string: {l_prop}, l_id: {l_id}");

            let r_op = &e[e.find(',').unwrap()+1..e.len()-1];
            let r_id = (&r_op[0..r_op.find('#').unwrap()]).parse::<i32>().unwrap();
            let r_prop = &r_op[r_op.find('#').unwrap()+1..r_op.len()];

            println!("[DEBUG] r_prop string: {r_prop}, r_id: {r_id}");

            Rc::new(RefCell::new(LessThan {
                mm: Rc::clone(map),
                l_id,
                l_prop: String::from(l_prop),
                r_id,
                r_prop: String::from(r_prop)
            }))

        }

        _ =>  Rc::new(RefCell::new(Default{}))
    }
}

fn main() {
    let test = Rc::new(RefCell::new(MarkerMap{ map: HashMap::new() }));

    let expr = String::from("$AND(0#d,$NOT($LT(0#x,0#y)))");
    println!("[INFO] Expression: {}", expr);

    let func = parse_expression(&expr, &test);

    test.borrow_mut().update_marker(0, true, 34, 454, 30);
    test.borrow_mut().update_marker(1, false, 34, 454, 30);
    
    test.borrow().print_markers();

    let mut ans = func.borrow_mut().evaluate();
    println!("[RESULT] Answer: {ans}");

    test.borrow_mut().update_marker(0, false, 645, 454, 30);
    test.borrow_mut().update_marker(1, true, 34, 454, 30);
    test.borrow().print_markers();

    // // // ans = testStruct.parse_expression(&expr)();
    ans = func.borrow_mut().evaluate();
    println!("[RESULT] Answer: {ans}");



    // Reference for mutable references with Rc + RefCell
    // let b = Rc::new(RefCell::new(7));
    // let a = Rc::clone(&b);

    // println!("a: {}, b: {}", a.borrow(), b.borrow()); // --> a = 7, b = 7

    // *b.borrow_mut() = 5;
    // println!("a: {}, b: {}", a.borrow(), b.borrow()); // --> a = 5, b = 5

}
