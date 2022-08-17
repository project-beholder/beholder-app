#include <node.h>
#include <ApplicationServices/ApplicationServices.h>
#include <iostream>

namespace demo {
  using v8::Exception;
  using v8::FunctionCallbackInfo;
  using v8::Isolate;
  using v8::Local;
  using v8::Number;
  using v8::Object;
  using v8::String;
  using v8::Value;

  CGEventRef evt;
  CGEventSourceRef src;

  void Release(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    // wtf is isolate->IsNumber() syntax O.o
    if (!args[0]->IsNumber()) {
      isolate->ThrowException(Exception::TypeError(
          String::NewFromUtf8(isolate, "Wrong arguments").ToLocalChecked()));
      return;
    }

    int keyCode = args[0].As<Number>()->Value();
    evt = CGEventCreateKeyboardEvent(src, (CGKeyCode)keyCode, false);
    CGEventPost(kCGHIDEventTap, evt);
    CFRelease(evt);
  }

  void Press(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    // wtf is isolate->IsNumber() syntax O.o
    if (!args[0]->IsNumber()) {
      isolate->ThrowException(Exception::TypeError(
          String::NewFromUtf8(isolate, "Wrong arguments").ToLocalChecked()));
      return;
    }

    int keyCode = args[0].As<Number>()->Value();
    evt = CGEventCreateKeyboardEvent(src, (CGKeyCode)keyCode, true);
    CGEventPost(kCGHIDEventTap, evt);
    CFRelease(evt);
  }

  void Init(const FunctionCallbackInfo<Value>& args) {
    src = CGEventSourceCreate(kCGEventSourceStateHIDSystemState);
  }

  void Initialize(Local<Object> exports) {
    NODE_SET_METHOD(exports, "init", Init);
    NODE_SET_METHOD(exports, "press", Press);
    NODE_SET_METHOD(exports, "release", Release);
  }

  NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
}
