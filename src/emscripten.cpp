#include <emscripten/bind.h>
#include "StormLib.h"

EMSCRIPTEN_BINDINGS(my_module) {
    function("SFileOpenArchive", &SFileOpenArchive, emscripten::allow_raw_pointers());

}