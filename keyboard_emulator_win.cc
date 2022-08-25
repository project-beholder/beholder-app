#include <node.h>

#define WINVER 0x0500
#include <Windows.h>

namespace demo {
    using v8::Exception;
    using v8::FunctionCallbackInfo;
    using v8::Isolate;
    using v8::Local;
    using v8::Number;
    using v8::Object;
    using v8::String;
    using v8::Value;

    INPUT ip;

    void Release(const FunctionCallbackInfo<Value>& args) {
        Isolate* isolate = args.GetIsolate();

        if (!args[0]->IsNumber()) {
            isolate->ThrowException(Exception::TypeError(
                String::NewFromUtf8(isolate, "Wrong arguments").ToLocalChecked()
            ));
            return;
        }

        // Create keyboard event for release
        // ZeroMemory(ip, sizeof(INPUT));
        ip.type = INPUT_KEYBOARD;
        ip.ki.wVk  = args[0].As<Number>()->Value();
        ip.ki.dwFlags = KEYEVENTF_KEYUP;
        // ip.ki.wScan = args[0].As<Number>()->Value();
        // ip.ki.dwFlags = KEYEVENTF_KEYUP;

        // Send event
        SendInput(1, &ip, sizeof(INPUT));
    }

    void Press(const FunctionCallbackInfo<Value>& args) {
        Isolate* isolate = args.GetIsolate();

        if (!args[0]->IsNumber()) {
            isolate->ThrowException(Exception::TypeError(
                String::NewFromUtf8(isolate, "Wrong arguments").ToLocalChecked()
            ));
            return;
        }

        // Create keyboard event for press
        // ZeroMemory(ip, sizeof(INPUT));
        ip.type = INPUT_KEYBOARD;
        ip.ki.wVk  = args[0].As<Number>()->Value();
        // ip.ki.wScan = args[0].As<Number>()->Value();
        // ip.ki.dwFlags = KEYEVENTF_SCANCODE;

        // Send event
        SendInput(1, &ip, sizeof(INPUT));
    }

    void Initialize(Local<Object> exports) {
        NODE_SET_METHOD(exports, "press", Press);
        NODE_SET_METHOD(exports, "release", Release);
    }

    NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize);
}
