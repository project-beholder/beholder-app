pub mod operations;
use self::operations::*;

pub mod markers;
use self::markers::{MarkerMap, MarkerProperties};

use std::collections::HashMap;
use std::rc::Rc;
use std::cell::{RefCell, Ref};
use std::sync::mpsc::Receiver;

fn parse_expression(e: &str) -> &dyn Evaluate {
    println!("[DEBUG] Evaluating command: {}", e);
    let cmd = &e[0..e.find('(').unwrap()];

    match cmd {
        "$VAL" => {
            let id = (&e[e.find('(').unwrap()+1..e.find('#').unwrap()]).parse::<i32>().unwrap();
            let prop = &e[e.find('#').unwrap()+1..e.find(')').unwrap()];
            println!("[DEBUG] Found parameter: marker [{}], property [{}]", id, prop);
            match prop {
                "d" => Value{
                    id: id,
                    prop: MarkerProperties::D
                },
                _ => Default{}
            }
        },
        "$NOT" => {
            let op = &e[e.find('(').unwrap()+1..e.len()-1];
            match op.find('$') {
                Some(_) => Not {
                    pointer: parse_expression(op)
                },
                None => {
                    let mut val_op = String::from("$VAL(");
                    val_op.push_str(op);
                    val_op.push_str(")");
                    println!("[DEBUG] Changing operand {} to {}", op, val_op);

                    Not {
                        pointer: parse_expression(&val_op)
                    }
                }
            }
        },
        "$AND" => {
            let l_op = &e[e.find('(').unwrap()+1..e.find(',').unwrap()];
            let r_op = &e[e.find(',').unwrap()+1..e.len()-1];

            println!("[DEBUG] Found l_op: {l_op}, r_op: {r_op}");

            let l_fn = match l_op.find('$') {
                Some(_) => parse_expression(l_op),
                None => {
                    let mut val_op = String::from("$VAL(");
                    val_op.push_str(l_op);
                    val_op.push_str(")");
                    println!("[DEBUG] Changing operand {} to {}", l_op, val_op);

                    parse_expression(&val_op)
                }
            };

            let r_fn = match r_op.find('$') {
                Some(_) => parse_expression(r_op),
                None => {
                    let mut val_op = String::from("$VAL(");
                    val_op.push_str(r_op);
                    val_op.push_str(")");
                    println!("[DEBUG] Changing operand {} to {}", r_op, val_op);

                    parse_expression(&val_op)
                }
            };

            And {
                pointer_l: l_fn,
                pointer_r: r_fn
            }
        },
        "$OR" => {
            let l_op = &e[e.find('(').unwrap()+1..e.find(',').unwrap()];
            let r_op = &e[e.find(',').unwrap()+1..e.len()-1];

            let l_fn = match l_op.find('$') {
                Some(_) => parse_expression(l_op),
                None => {
                    let mut val_op = String::from("$VAL(");
                    val_op.push_str(l_op);
                    val_op.push_str(")");
                    println!("[DEBUG] Changing operand {} to {}", l_op, val_op);

                    parse_expression(&val_op)
                }
            };

            let r_fn = match r_op.find('$') {
                Some(_) => parse_expression(r_op),
                None => {
                    let mut val_op = String::from("$VAL(");
                    val_op.push_str(r_op);
                    val_op.push_str(")");
                    println!("[DEBUG] Changing operand {} to {}", r_op, val_op);

                    parse_expression(&val_op)
                }
            };

            Or {
                pointer_l: l_fn,
                pointer_r: r_fn
            }
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

            GreaterThan {
                l_id,
                l_prop: String::from(l_prop),
                r_id,
                r_prop: String::from(r_prop)
            }

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

            LessThan {
                l_id,
                l_prop: String::from(l_prop),
                r_id,
                r_prop: String::from(r_prop)
            }

        }

        _ => Default{}
    }
}

fn main() {
    let mut test = MarkerMap{ map: HashMap::new() };

    let expr = String::from("$AND(0#d,$NOT($LT(0#x,0#y)))");
    println!("[INFO] Expression: {}", expr);

    let func = parse_expression(&expr);

    test.update_marker(0, true, 34, 454, 30);
    test.update_marker(1, false, 34, 454, 30);
    
    test.print_markers();

    let mut ans = func.borrow_mut().evaluate(&test);
    println!("[RESULT] Answer: {ans}");

    test.update_marker(0, false, 645, 454, 30);
    test.update_marker(1, true, 34, 454, 30);
    test.print_markers();

    // // // ans = testStruct.parse_expression(&expr)();
    ans = func.borrow_mut().evaluate(&test);
    println!("[RESULT] Answer: {ans}");



    // Reference for mutable references with Rc + RefCell
    // let b = Rc::new(RefCell::new(7));
    // let a = Rc::clone(&b);

    // println!("a: {}, b: {}", a.borrow(), b.borrow()); // --> a = 7, b = 7

    // *b.borrow_mut() = 5;
    // println!("a: {}, b: {}", a.borrow(), b.borrow()); // --> a = 5, b = 5

}
