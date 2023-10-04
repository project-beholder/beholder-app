// pub enum GeneralOp {
//     Val(Value),
//     Gt(GreaterThan),
//     Lt(LessThan),
// }

use std::rc::Rc;
use std::cell::{RefCell, Ref};

use crate::markers::{MarkerMap, MarkerInfo, MarkerProperties};

pub trait Evaluate {
    fn evaluate(&self) -> bool;
}

pub struct Default {}
impl Evaluate for Default {
    fn evaluate(&self) -> bool {
        return false;
    }
}

pub struct Value {
    pub mm: Rc<RefCell<MarkerMap>>,
    pub id: i32,
    pub prop: MarkerProperties
    // pub pointer: Rc<RefCell<bool>>
}

impl Evaluate for Value {
    fn evaluate(&self) -> bool {
        println!("[INFO] Evaluating function: Value");
        // println!("Pointer val: {}", *self.pointer.borrow());
        // match *self.pointer.borrow() {
        //     Operand::Boolean(b) => b,
        //     Operand::Function(f) => f.evaluate(),
        //     _ => false
        // }

        // (*self.pointer.borrow()).evaluate()
        // *(self.pointer.borrow())()
        // println!("Returning VAL: {}", *self.pointer.borrow());
        // *self.pointer.borrow()
        match self.prop {
            MarkerProperties::D => self.mm.borrow().get_marker_detect(&self.id),
            _ => false
        }
    }
}

pub struct GreaterThan {
    // pub pointer_l: Rc<RefCell<i32>>,
    // pub pointer_r: Rc<RefCell<i32>>,

    pub mm: Rc<RefCell<MarkerMap>>,
    pub l_id: i32,
    pub l_prop: String,
    pub r_id: i32, 
    pub r_prop: String
}

impl Evaluate for GreaterThan {
    fn evaluate(&self) -> bool {
        println!("[INFO] Evaluating function: GreaterThan");

        println!("[DEBUG] Operating on l_op: {:?}, r_op: {:?}", self.l_prop, self.r_prop);

        let l_op = self.mm.borrow().get_marker_prop(&self.l_id, &self.l_prop);
        let r_op = self.mm.borrow().get_marker_prop(&self.r_id, &self.r_prop);

        println!("[DEBUG] Comparing {} > {}", l_op, r_op);

        l_op > r_op
    }

    // fn evaluate(&self) -> bool {
    //     *self.pointer_l.borrow() > *self.pointer_r.borrow()
    // }
}

// impl GreaterThan {
//     pub fn evaluate(&self) -> bool {
//         *self.pointer_l > *self.pointer_r
//     }
// }

pub struct LessThan {
    pub mm: Rc<RefCell<MarkerMap>>,
    pub l_id: i32,
    pub l_prop: String,
    pub r_id: i32, 
    pub r_prop: String
}

impl Evaluate for LessThan {
    fn evaluate(& self) -> bool {
        println!("[INFO] Evaluating function: LessThan");

        println!("[DEBUG] Operating on l_op: {:?}, r_op: {:?}", self.l_prop, self.r_prop);

        let l_op = self.mm.borrow().get_marker_prop(&self.l_id, &self.l_prop);
        let r_op = self.mm.borrow().get_marker_prop(&self.r_id, &self.r_prop);

        println!("[DEBUG] Comparing {} < {}", l_op, r_op);

        l_op < r_op    }
}

// impl LessThan {
//     pub fn evaluate(&self) -> bool {
//         *self.pointer_l < *self.pointer_r
//     }
// }

pub struct Between {
    pub pointer_l: Rc<RefCell<i32>>,
    pub pointer_m: Rc<RefCell<i32>>,
    pub pointer_r: Rc<RefCell<i32>>
}

impl Evaluate for Between {
    fn evaluate(&self) -> bool {
        (*self.pointer_l.borrow() < *self.pointer_m.borrow()) && (*self.pointer_m.borrow() < *self.pointer_r.borrow())
    }
}

pub struct Not {
    pub pointer: Rc<RefCell<dyn Evaluate>>
}

impl Evaluate for Not {
    fn evaluate(&self) -> bool {
        println!("[INFO] Evaluating function: Not");

        // println!("Pointer val: {}", *self.pointer.borrow());
        // !(*self.pointer.borrow())
        // println!("Returning NOT: {}", !self.pointer.borrow().evaluate());
        !(self.pointer.borrow().evaluate())
    }
}

pub struct And {
    pub pointer_l: Rc<RefCell<dyn Evaluate>>,
    pub pointer_r: Rc<RefCell<dyn Evaluate>>
}

impl Evaluate for And {
    fn evaluate(&self) -> bool {
        println!("[INFO] Evaluating function: And");

        // *self.pointer_l.borrow() && *self.pointer_r.borrow()
        self.pointer_l.borrow().evaluate() && self.pointer_r.borrow().evaluate()
    }
}

pub struct Or {
    pub pointer_l: Rc<RefCell<dyn Evaluate>>,
    pub pointer_r: Rc<RefCell<dyn Evaluate>>
}

impl Evaluate for Or {
    fn evaluate(&self) -> bool {
        println!("[INFO] Evaluating function: Or");

        self.pointer_l.borrow().evaluate() || self.pointer_r.borrow().evaluate()
    }
}