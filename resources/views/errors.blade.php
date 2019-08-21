@if($errors->any())
    @foreach($errors->all() as $error)
        <p class="error">{{$error}}</p>
    @endforeach
@endif
@if(isset($customError))
    <p class="error">{{$customError}}</p>
@endif