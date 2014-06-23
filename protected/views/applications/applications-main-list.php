<?php
    $server_types = ZHtml::enumItem(Servers::model(), 'server_type');
    $select_types = array(''=>'--Select Server Type--') + $server_types;
?>

<div id="app-main-list" class="table-main" style="display:none";>
    <fieldset>
        <input type="hidden" id="app-main-list-csrf" value="<?php echo Yii::app()->request->csrfToken ?>" />
        <div class="table-header-block">
            <div class="header-block-button">
                <a id="app-main-list-create-button" class="button round blue image-right ic-add text-upper" href="#">Create Application</a>
            </div><!-- End Header Block Button -->

            <div class="header-block-side">
                <div class="page-nav">
                    <div class="page-count">
                        <span class="current-page" id="app-main-list-part"></span>
                        <span class="all-page" id="app-main-list-total"></span>
                    </div>
                    <div class="page-nav-arrow">
                        <a id="app-main-list-prev" class="prev" href="#" title="Previous"><span class="icon"></span></a>
                        <a id="app-main-list-next" class="next" href="#" title="Next"><span class="icon"></span></a>
                    </div>
                </div>
            </div><!-- End Header Block Side -->
        </div><!-- End Table Header Block -->
        
        <!-- advanced search -->
        <div id="app-main-advanced" class="contact-info plain-list" style="display:none;">
            <form>
                <div class="contact-info-details">
                    <div class="section primary-info expanded">
                        <div id="expand-primary" class="header">
                            <b>Advanced Search</b>
                            <a id="app-main-advanced-close-button" href="#" style="float:right;"><b><i class="small-text">(switch to Basic Search)</i></b></a>
                        </div>
                    </div>
                    <div id="edit-primary-content" class="content small-text" s>
                        <div style="height:75px;padding-left:20px;padding-right:20px;">
                            <div class="search-box" >
                                <label>Application</label>
                                <input id="app-main-advanced-application" type="text"/>
                            </div>
                            <div class="search-box">
                                <label>Project</label>
                                <input id="app-main-advanced-project" type="text"/>
                            </div>
                            <div class="search-box">
                                <label>R&D Point Person</label>
                                <input id="app-main-advanced-pointperson" type="text"/>
                            </div>
                            <div style="float:right;padding:5px;text-align:center;">
                                <button id="app-main-advanced-search-button" class="red-button">Search</button><br>
                                <a href="#" id="app-main-advanced-clear-button"><b>Clear</b></a>
                            </div>
                        </div>
                        <div>
                            <!-- search by server -->
                            <div class="half-box">
                                <div class="search-by">
                                    <b>Servers</b>
                                    <div>
                                        <div class="search-box">
                                            <label>Server Type</label>
                                            <select id="app-main-advanced-servertype">
                                            <?php
                                                foreach($select_types as $key => $value)
                                                {
                                                    ?>
                                                    <option value="<?= $key ?>"><?= $value ?></option>
                                                    <?php
                                                }
                                            ?>
                                            </select>
                                        </div>
                                        <div class="search-box">
                                            <label>Server Name</label>
                                            <input id="app-main-advanced-servername" type="text" disabled/>
                                            <a id="app-main-advanced-serverclear-button" style="float:right;" href="#"><img class="close" src="<?= Yii::app()->baseUrl ?>/css/close.png"></img></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- search by point person -->
                            <div class="half-box">
                                <div class="search-by">
                                    <b>Point Persons</b>
                                    <div>
                                        <div class="search-box">
                                            <label>User Group</label>
                                            <select id="app-main-advanced-usergroup"></select>
                                        </div>
                                        <div class="search-box">
                                            <label>Name</label>
                                            <select id="app-main-advanced-username"></select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>

        <div id="content-div">
            <form>
                <table id="test">
                    <thead>
                        <tr>                      
                            <th width="200">Name</th>
                            <th width="200">Project</th>
                            <th width="200">R&D Point Person</th>
                            <th>Description</th>
                            <th width="50"></th>
                        </tr>
                        <tr id="app-main-list-basic" style="display:table-row;">
                            <th><input id="app-main-list-search-name" type="text" style="width:180px;"/></th>
                            <th><input id="app-main-list-search-project" type="text" style="width:180px;"/></th>
                            <th><input id="app-main-list-search-point" type="text" style="width:180px;"/></th>
                            <th colspan="2">
                                <div style="float:right">
                                    <div style="float:right">
                                        <button id="app-main-list-search-button" class="red-button">Search</button><br>
                                        <a href="#" id="app-main-list-clear-button">Clear</a>
                                    </div><br><br><br>
                                    <a href="#" id="app-main-list-advanced-button"><i>(switch to Advanced Search)</i></a>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody id="app-main-list-table"></tbody>
                </table>
            </form>
        </div>
    </fieldset>
    <div class="loader-container" id="loader">
        <span class="loader"></span>
        <div class="loader-modal"></div>
    </div><!-- End Table main -->
</div><!--END View User List-->